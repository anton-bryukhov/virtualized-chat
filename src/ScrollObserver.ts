import { isSome } from "./utils";
import { RefObject, useEffect, useMemo } from "react";

class ScrollObserver {
  private readonly intersectionObserver: IntersectionObserver;
  private readonly mutationObserver: MutationObserver;
  private readonly onStartReached?: () => Promise<void>;
  private readonly onEndReached?: () => Promise<void>;
  private targetScrollable?: Element;

  constructor({
    onStartReached,
    onEndReached,
  }: {
    onStartReached?: () => Promise<void>;
    onEndReached?: () => Promise<void>;
  }) {
    this.onStartReached = onStartReached;
    this.onEndReached = onEndReached;
    this.intersectionObserver = new IntersectionObserver(
      this.intersectionObserverCallback,
      { threshold: 1 }
    );
    this.mutationObserver = new MutationObserver(this.mutationCallback);
  }

  observe(targetScrollable: Element) {
    this.targetScrollable = targetScrollable;
    this.mutationObserver.observe(targetScrollable, { childList: true });
    this.mutationCallback();
  }

  disconnect() {
    this.mutationObserver.disconnect();
    this.intersectionObserver.disconnect();
  }

  private mutationCallback = () => {
    this.intersectionObserver.disconnect();
    const firstElementChild = this.targetScrollable?.firstElementChild;
    if (isSome(firstElementChild)) {
      this.intersectionObserver.observe(firstElementChild);
    }
    const lastElementChild = this.targetScrollable?.lastElementChild;
    if (isSome(lastElementChild)) {
      this.intersectionObserver.observe(lastElementChild);
    }
  };

  private startZoneIsInFocus: boolean = false;
  private endZoneIsInFocus: boolean = false;

  private intersectionObserverCallback: IntersectionObserverCallback = (
    entries
  ) => {
    entries.forEach(({ isIntersecting, target: target }) => {
      if (isIntersecting) {
        if (target === this.targetScrollable?.firstElementChild) {
          this.onEnterStartZone(target);
        } else if (target === this.targetScrollable?.lastElementChild) {
          this.onEnterEndZone(target);
        }
      } else {
        if (target === this.targetScrollable?.firstElementChild) {
          this.onExitStartZone();
        } else if (target === this.targetScrollable?.lastElementChild) {
          this.onExitEndZone();
        }
      }
    });
  };

  private onEnterStartZone(target: Element) {
    this.startZoneIsInFocus = true;
    this.onStartReached?.()?.then(() => {
      if (this.startZoneIsInFocus) target.scrollIntoView();
    });
  }

  private onEnterEndZone(target: Element) {
    this.endZoneIsInFocus = true;
    this.onEndReached?.()?.then(() => {
      if (this.endZoneIsInFocus) target.scrollIntoView();
    });
  }

  private onExitStartZone() {
    this.startZoneIsInFocus = false;
  }

  private onExitEndZone() {
    this.endZoneIsInFocus = false;
  }
}

export function useScrollObserver({
  listRef,
  onStartReached,
  onEndReached,
}: {
  listRef: RefObject<HTMLElement>;
  onStartReached?: () => Promise<void>;
  onEndReached?: () => Promise<void>;
}) {
  const observer = useMemo(
    () => new ScrollObserver({ onStartReached, onEndReached }),
    [onStartReached, onEndReached]
  );
  useEffect(() => {
    const list = listRef.current;
    if (isSome(list)) {
      observer.observe(list);
    }
    return () => observer.disconnect();
  }, [observer]);
}

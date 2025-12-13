import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const MIN_SWIPE_DISTANCE = 50;

export const useSwipe = (handlers: SwipeHandlers) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchEndRef.current = null;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchEndRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) {
      touchStartRef.current = null;
      touchEndRef.current = null;
      return;
    }

    const distanceX = touchStartRef.current.x - touchEndRef.current.x;
    const distanceY = touchStartRef.current.y - touchEndRef.current.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    if (isHorizontalSwipe && Math.abs(distanceX) > MIN_SWIPE_DISTANCE) {
      if (distanceX > 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      } else if (distanceX < 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      }
    } else if (isVerticalSwipe && Math.abs(distanceY) > MIN_SWIPE_DISTANCE) {
      if (distanceY > 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      } else if (distanceY < 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [handlers]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};


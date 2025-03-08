"use client";

import { Box, keyframes } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";

// 定义各种动画效果
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromRight = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInFromBottom = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const zoomIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const bounce = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

// 动画类型
type AnimationType =
  | "fadeIn"
  | "slideInFromLeft"
  | "slideInFromRight"
  | "slideInFromBottom"
  | "zoomIn"
  | "bounce";

// 组件属性
interface ScrollAnimationProps {
  children: ReactNode;
  animationType: AnimationType;
  delay?: number; // 延迟时间（秒）
  duration?: number; // 动画持续时间（秒）
  threshold?: number; // 触发阈值（0-1之间，表示元素有多少部分进入视口时触发）
  repeat?: boolean; // 是否重复动画
  [key: string]: any; // 其他属性
}

/**
 * 滚动动画组件
 * 当元素进入视口时添加动画效果
 */
export default function ScrollAnimation({
  children,
  animationType = "fadeIn",
  delay = 0,
  duration = 0.8,
  threshold = 0.2,
  repeat = false,
  ...rest
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 根据动画类型获取对应的动画关键帧
  const getAnimation = (type: AnimationType) => {
    switch (type) {
      case "fadeIn":
        return fadeIn;
      case "slideInFromLeft":
        return slideInFromLeft;
      case "slideInFromRight":
        return slideInFromRight;
      case "slideInFromBottom":
        return slideInFromBottom;
      case "zoomIn":
        return zoomIn;
      case "bounce":
        return bounce;
      default:
        return fadeIn;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当元素进入视口时
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 如果不需要重复动画，则取消观察
          if (!repeat) {
            observer.unobserve(entry.target);
          }
        } else if (repeat) {
          // 如果需要重复动画，则当元素离开视口时重置状态
          setIsVisible(false);
        }
      },
      {
        root: null, // 使用视口作为根
        rootMargin: "0px", // 视口边距
        threshold: threshold, // 触发阈值
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [repeat, threshold]);

  return (
    <Box
      ref={ref}
      animation={
        isVisible
          ? `${getAnimation(
              animationType
            )} ${duration}s ${delay}s ease-out forwards`
          : "none"
      }
      opacity={0} // 初始状态为不可见
      {...rest}
    >
      {children}
    </Box>
  );
}

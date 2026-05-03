"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface ScissorsIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ScissorsIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ScissorsIcon = forwardRef<ScissorsIconHandle, ScissorsIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g
            animate={controls}
            variants={{
              normal: { rotate: 0 },
              animate: {
                rotate: [0, -26, 0],
                transition: {
                  duration: 0.6,
                  ease: "easeInOut",
                },
              },
            }}
          >
            <circle cx="6" cy="6" r="3" />
            <motion.path
              animate={controls}
              d="M8.12 8.12 12 12"
              variants={{
                normal: { d: "M8.12 8.12 12 12" },
                animate: {
                  d: ["M8.12 8.12 12 12", "M8.12 8.12 12 12"],
                },
              }}
            />
            <motion.path
              animate={controls}
              d="M14.8 14.8 20 20"
              variants={{
                normal: { d: "M14.8 14.8 20 20" },
                animate: {
                  d: ["M14.8 14.8 20 20", "M14.8 14.8 20 20"],
                },
              }}
            />
          </motion.g>
          <motion.g
            animate={controls}
            variants={{
              normal: { rotate: 0 },
              animate: {
                rotate: [0, 26, 0],
                transition: {
                  duration: 0.6,
                  ease: "easeInOut",
                },
              },
            }}
          >
            <circle cx="6" cy="18" r="3" />
            <motion.path
              animate={controls}
              d="M20 4 8.12 15.88"
              variants={{
                normal: { d: "M20 4 8.12 15.88" },
                animate: {
                  d: ["M20 4 8.12 15.88", "M20 4 8.12 15.88"],
                },
              }}
            />
          </motion.g>
        </svg>
      </div>
    );
  },
);

ScissorsIcon.displayName = "ScissorsIcon";

export { ScissorsIcon };

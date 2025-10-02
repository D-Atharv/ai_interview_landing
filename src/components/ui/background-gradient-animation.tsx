'use client';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = 'rgb(24, 24, 27)',
  gradientBackgroundEnd = 'rgb(39, 39, 42)',
  firstColor = '18, 116, 255',
  secondColor = '221, 75, 255',
  thirdColor = '100, 220, 255',
  fourthColor = '200, 50, 50',
  fifthColor = '180, 180, 180',
  pointerColor = '140, 100, 255',
  size = '80%',
  blendingValue = 'hard-light',
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const transition = {
    duration: 5,
    ease: 'linear',
    repeat: Infinity,
    repeatType: 'mirror' as const,
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (interactive && isMounted) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        x.set(clientX / innerWidth);
        y.set(clientY / innerHeight);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, isMounted, x, y]);

  return (
    <div
      className={cn(
        'h-full w-full absolute inset-0',
        containerClassName
      )}
    >
      <div
        className={cn(
          'absolute inset-0 z-0',
          '[&>div]:animate-hue-rotate'
        )}
        style={{
          backgroundImage: `linear-gradient(45deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
        }}
      >
        {isMounted && (
          <>
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at center, rgba(${firstColor}, 0.8) 0, transparent 50%)`,
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={transition}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at center, rgba(${secondColor}, 0.8) 0, transparent 50%)`,
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['100% 0%', '0% 100%'],
              }}
              transition={transition}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at center, rgba(${thirdColor}, 0.8) 0, transparent 50%)`,
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 100%', '100% 0%'],
              }}
              transition={transition}
            />
            {interactive && (
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at ${x.get() * 100}% ${y.get() * 100}%, rgba(${pointerColor}, 0.8) 0, transparent 50%)`,
                  backgroundSize: size,
                  mixBlendMode: blendingValue,
                }}
              />
            )}
          </>
        )}
      </div>
      {children}
    </div>
  );
};

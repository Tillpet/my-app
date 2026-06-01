// remotion/compositions/Hero.tsx

import { useCurrentFrame } from "remotion";

export const Hero = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        fontSize: 80,
        transform: `translateY(${100 - frame}px)`,
      }}
    >
      Hello Remotion
    </div>
  );
};

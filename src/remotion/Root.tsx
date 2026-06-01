// remotion/Root.tsx

import { Composition } from "remotion";
import { Hero } from "./compositions/Hero";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Hero"
      component={Hero}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

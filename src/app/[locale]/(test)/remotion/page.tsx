"use client";

import { Player } from "@remotion/player";
import { Hero } from "@/remotion/compositions/Hero";

type Props = {
  title: string;
  subtitle: string;
};

export const Video = ({ title, subtitle }: Props) => {
  return (
    <>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </>
  );
};

export default function Page() {
  return (
    <div className="flex justify-center p-4">
      <Player
        component={Hero}
        durationInFrames={300}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        controls
        style={{
          width: "100%",
        }}
      />
      <Player
        component={Video}
        inputProps={{ title: "Hello Remotion", subtitle: "A video" }}
        durationInFrames={300}
        fps={30}
        compositionWidth={1920}
        compositionHeight={1080}
        controls
        style={{
          width: "100%",
        }}
      />
    </div>
  );
}

import { HtmlSvg } from "@/types/common";

export interface Province {
  name: string;
  islandEls: HtmlSvg[];
  primaryIsland: {
    element: HtmlSvg | null;
    props: DOMRect;
  };
}

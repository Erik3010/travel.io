import { HtmlSvg } from "@/types/common";

export interface Province {
  id: string;
  name: string;
  islandEls: HtmlSvg[];
  primaryIsland: {
    element: HtmlSvg | null;
    props: DOMRect;
  };
}

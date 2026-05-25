"use client";

import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import type { ReactNode } from "react";

type Props = {
  resultsCount: number;
  recommendsCount: number;
  resultsPanel: ReactNode;
  recommendsPanel: ReactNode;
};

const tabClassName = ({ selected }: { selected: boolean }) =>
  selected
    ? "border-b-2 border-green-500 px-2 py-3 text-sm font-medium text-green-600 focus:outline-none"
    : "border-b-2 border-transparent px-2 py-3 text-sm text-zinc-600 hover:text-zinc-900 focus:outline-none";

const badgeClassName = (selected: boolean) =>
  selected
    ? "ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700"
    : "ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600";

export default function Tabs({
  resultsCount,
  recommendsCount,
  resultsPanel,
  recommendsPanel,
}: Props) {
  return (
    <TabGroup>
      <TabList className="flex gap-6 border-b border-zinc-200">
        <Tab className={tabClassName}>
          {({ selected }) => (
            <>
              検索結果
              <span className={badgeClassName(selected)}>{resultsCount}</span>
            </>
          )}
        </Tab>
        <Tab className={tabClassName}>
          {({ selected }) => (
            <>
              みんなのおすすめ
              <span className={badgeClassName(selected)}>
                {recommendsCount}
              </span>
            </>
          )}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{resultsPanel}</TabPanel>
        <TabPanel>{recommendsPanel}</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

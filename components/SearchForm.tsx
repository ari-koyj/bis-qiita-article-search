"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState, type FormEvent, type KeyboardEvent } from "react";

import Tag from "@/components/Tag";

export type SearchParams = {
  title: string;
  dateFrom: string;
  dateTo: string;
  tags: string[];
};

type Props = {
  onSearch?: (params: SearchParams) => void;
  onReset?: () => void;
};

// 補完候補(後で Qiita のタグ一覧やキャッシュから取得する想定)
const TAG_SUGGESTIONS = ["React"];

// 投稿日範囲の選択肢
type DateRange = "" | "3m" | "6m" | "1y";

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: "", label: "指定なし" },
  { value: "3m", label: "3か月以内" },
  { value: "6m", label: "半年以内" },
  { value: "1y", label: "1年以内" },
];

// 選択された期間から `dateFrom` の文字列(YYYY-MM-DD)を算出
function dateRangeToFrom(range: DateRange): string {
  if (!range) return "";
  const from = new Date();
  switch (range) {
    case "3m":
      from.setMonth(from.getMonth() - 3);
      break;
    case "6m":
      from.setMonth(from.getMonth() - 6);
      break;
    case "1y":
      from.setFullYear(from.getFullYear() - 1);
      break;
  }
  return from.toISOString().split("T")[0];
}

export default function SearchForm({ onSearch, onReset }: Props) {
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const hasInput =
    title.trim().length > 0 || dateRange !== "" || tags.length > 0;

  // 入力内容で絞り込んだ補完候補(既に追加済みのタグは除外)
  // 入力が空のときは候補を表示しない(タイプ開始後のみ補完)
  const filteredSuggestions =
    tagInput === ""
      ? []
      : TAG_SUGGESTIONS.filter(
          (s) =>
            s.toLowerCase().includes(tagInput.toLowerCase()) &&
            !tags.includes(s),
        );

  const addTag = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Combobox で候補がクリック or Enter 選択されたとき
  const handleSuggestionSelect = (selected: string | null) => {
    if (selected) addTag(selected);
  };

  // 候補にない文字列を Enter で直接追加できるようにする
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    // 候補に完全一致するものがない場合のみ手入力タグを追加
    // 候補がある場合は Combobox 側の Enter ハンドラに任せる
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!filteredSuggestions.includes(trimmed)) {
      e.preventDefault();
      addTag(trimmed);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!hasInput) return;
    onSearch?.({
      title: title.trim(),
      dateFrom: dateRangeToFrom(dateRange),
      dateTo: "",
      tags,
    });
  };

  const handleReset = () => {
    setTitle("");
    setDateRange("");
    setTags([]);
    setTagInput("");
    onReset?.();
  };

  const selectedDateLabel =
    DATE_RANGE_OPTIONS.find((o) => o.value === dateRange)?.label ?? "指定なし";

  return (
    <section className="border-b border-zinc-200 bg-orange-50">
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label
              htmlFor="search-title"
              className="mb-1 block text-sm text-zinc-600"
            >
              タイトル
            </label>
            <input
              id="search-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="入力してください"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-600">投稿日</label>
            <Listbox value={dateRange} onChange={setDateRange}>
              <div className="relative">
                <ListboxButton
                  className={`flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    dateRange ? "text-zinc-900" : "text-zinc-400"
                  }`}
                >
                  <span>{selectedDateLabel}</span>
                  <svg
                    viewBox="0 0 20 20"
                    className="size-4 text-zinc-400"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg focus:outline-none">
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <ListboxOption
                      key={opt.value}
                      value={opt.value}
                      className="cursor-pointer px-3 py-2 text-sm data-focus:bg-green-50 data-focus:text-green-700"
                    >
                      {opt.label}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="search-tag"
            className="mb-1 block text-sm text-zinc-600"
          >
            タグ
          </label>
          {tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
              ))}
            </div>
          )}
          <Combobox<string | null>
            immediate
            value={null}
            onChange={handleSuggestionSelect}
          >
            <div className="relative">
              <ComboboxInput
                id="search-tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="タグを入力してEnterで追加..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              {filteredSuggestions.length > 0 && (
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg focus:outline-none">
                  {filteredSuggestions.map((suggestion) => (
                    <ComboboxOption
                      key={suggestion}
                      value={suggestion}
                      className="cursor-pointer px-3 py-2 text-sm data-focus:bg-green-50 data-focus:text-green-700"
                    >
                      {suggestion}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              )}
            </div>
          </Combobox>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={!hasInput}
            className="rounded-lg border border-zinc-300 bg-white px-6 py-2 font-medium hover:bg-zinc-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:hover:bg-zinc-100"
          >
            検索
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-zinc-300 bg-white px-6 py-2 font-medium hover:bg-zinc-50"
          >
            リセット
          </button>
        </div>
      </form>
    </section>
  );
}

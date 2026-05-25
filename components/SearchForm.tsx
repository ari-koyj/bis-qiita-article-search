"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
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

export default function SearchForm({ onSearch, onReset }: Props) {
  const [title, setTitle] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const hasInput =
    title.trim().length > 0 ||
    dateFrom !== "" ||
    dateTo !== "" ||
    tags.length > 0;

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
    onSearch?.({ title: title.trim(), dateFrom, dateTo, tags });
  };

  const handleReset = () => {
    setTitle("");
    setDateFrom("");
    setDateTo("");
    setTags([]);
    setTagInput("");
    onReset?.();
  };

  return (
    <section className="border-b border-zinc-200 bg-orange-50">
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
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
            <label
              htmlFor="search-date-from"
              className="mb-1 block text-sm text-zinc-600"
            >
              投稿日(From)
            </label>
            <input
              id="search-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="search-date-to"
              className="mb-1 block text-sm text-zinc-600"
            >
              投稿日(To)
            </label>
            <input
              id="search-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
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
                <Tag
                  key={tag}
                  label={tag}
                  onRemove={() => removeTag(tag)}
                />
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

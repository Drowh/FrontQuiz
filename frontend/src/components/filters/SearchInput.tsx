// src/components/filters/SearchInput.tsx
import { RiSearchLine, RiCloseLine } from "@remixicon/react";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchInput = ({ searchQuery, setSearchQuery }: SearchInputProps) => {
  return (
    <div className="relative w-64">
      <input
        type="text"
        placeholder="Поиск..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-light-card dark:bg-dark-card text-text-secondary-light dark:text-text-secondary placeholder-text-secondary-light dark:placeholder-text-secondary border border-light-border dark:border-dark-border rounded-md py-2 pl-10 pr-10 focus:outline-none focus:border-primary-light dark:focus:border-primary transition"
      />
      <RiSearchLine
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary"
        size={20}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary hover:text-primary-light dark:hover:text-primary"
        >
          <RiCloseLine size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

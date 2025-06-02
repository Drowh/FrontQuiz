import React, { useState, useEffect } from "react";
import type { Category, Lesson } from "../types/lesson";
import {
  supabaseAdmin,
  type SupabaseAdminClient,
} from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const AddLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const [sequenceId, setSequenceId] = useState<string>("");
  const [category, setCategory] = useState<Category | "">("");
  const [title, setTitle] = useState<string>("");
  const [motivation, setMotivation] = useState<string>("");
  const [blocksJson, setBlocksJson] = useState<string>("[]");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Проверяем, что мы в режиме разработки
  useEffect(() => {
    if (!import.meta.env.DEV) {
      navigate("/");
    }
  }, [navigate]);

  // Если не в режиме разработки, не рендерим страницу
  if (!import.meta.env.DEV || !supabaseAdmin) {
    return null;
  }

  // Теперь TypeScript знает, что supabaseAdmin определен
  const adminClient: SupabaseAdminClient = supabaseAdmin;

  const categories: Category[] = ["HTML", "CSS", "JavaScript", "TypeScript"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!category || !sequenceId || !title || !motivation || !blocksJson) {
      setError("Please fill in all fields.");
      return;
    }

    let blocksArray;
    try {
      blocksArray = JSON.parse(blocksJson);
      if (!Array.isArray(blocksArray)) {
        throw new Error("Blocks must be a JSON array.");
      }
      // TODO: Добавить более строгую валидацию структуры блоков по типу AnyLessonBlock
    } catch (err: any) {
      setError(`Invalid JSON or blocks format: ${err.message}`);
      return;
    }

    const lessonData = {
      sequence_id: parseInt(sequenceId, 10), // Преобразуем в число
      category: category.toLowerCase(), // Храним в нижнем регистре в базе
      title,
      motivation,
      blocks: blocksArray,
    };

    try {
      const { error: supabaseError } = await adminClient
        .from("lessons")
        .insert([lessonData]);

      if (supabaseError) {
        setError(
          `Error adding lesson: ${supabaseError.message} (Code: ${supabaseError.code}`
        );
        // Часто ошибка дублирования ключа (23505) при попытке добавить урок с существующей категорией+sequence_id
        if (supabaseError.code === "23505") {
          setError(
            `Error adding lesson: Lesson with ID ${sequenceId} in category ${category} already exists.`
          );
        }
      } else {
        setMessage("Lesson added successfully!");
        // Очистить форму после успешного добавления
        setSequenceId("");
        setTitle("");
        setMotivation("");
        setBlocksJson("[]");
        // category можно оставить выбранной
      }
    } catch (err: any) {
      setError(`An unexpected error occurred: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6 text-white">Add New Lesson</h1>
      {message && <p className="text-green-400 mb-4">{message}</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <label htmlFor="category" className="w-40 text-white">
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            required
            className="p-2 border rounded bg-gray-800 text-white border-gray-600"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <label htmlFor="sequenceId" className="w-40 text-white">
            Lesson ID (within category):
          </label>
          <input
            type="number"
            id="sequenceId"
            value={sequenceId}
            onChange={(e) => setSequenceId(e.target.value)}
            required
            className="p-2 border rounded bg-gray-800 text-white border-gray-600"
          />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <label htmlFor="title" className="w-40 text-white">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border rounded w-full md:w-96 bg-gray-800 text-white border-gray-600"
          />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <label htmlFor="motivation" className="w-40 text-white">
            Motivation:
          </label>
          <textarea
            id="motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            required
            rows={3}
            className="p-2 border rounded w-full md:w-96 bg-gray-800 text-white border-gray-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="blocksJson" className="text-white">
            Blocks (JSON array):
          </label>
          <textarea
            id="blocksJson"
            value={blocksJson}
            onChange={(e) => setBlocksJson(e.target.value)}
            required
            rows={10}
            className="p-2 border rounded w-full bg-gray-800 text-white border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer self-start"
        >
          Add Lesson
        </button>
      </form>
    </div>
  );
};

export default AddLessonPage;

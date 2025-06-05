// src/App.tsx
import { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import AuthPage from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotificationProvider } from "./components/common/NotificationManager";
import { LoadingScreen } from "./components/LoadingScreen";
import AddLessonPage from "./pages/AddLessonPage";
import QuizPage from "./components/assessment/QuizPage";
import Header from "./components/layout/Header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        {!isLoading && (
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Header
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
            />
            <div className="pt-16">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <HomePage
                      searchQuery={searchQuery}
                      setSearchQuery={handleSearchChange}
                    />
                  }
                />

                <Route path="/quiz" element={<QuizPage />} />

                <Route
                  path="/lesson/:category/:id"
                  element={
                    <ProtectedRoute>
                      <LessonPage
                        searchQuery={searchQuery}
                        setSearchQuery={handleSearchChange}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin/add-lesson" element={<AddLessonPage />} />
              </Routes>
            </div>
          </Router>
        )}
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;

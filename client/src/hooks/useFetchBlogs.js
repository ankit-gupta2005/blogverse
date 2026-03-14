import { useState, useCallback, useEffect, useRef } from 'react';
import { getBlogs } from '../services/api';

const SCROLL_THRESHOLD = 300;

export const useFetchBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const observerTarget = useRef(null);

  const fetchBlogs = useCallback(async (pageNum) => {
    if (pageNum > totalPages) return;

    try {
      setIsLoading(true);
      setHasError(false);
      const { data } = await getBlogs(pageNum);

      setBlogs((prev) =>
        pageNum === 1 ? data.blogs : [...prev, ...data.blogs]
      );
      setTotalPages(data.totalPages);
    } catch (error) {
      setHasError(true);
      setErrorMessage(error?.response?.data?.message || 'Failed to load blogs');
      console.error('Blog fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [totalPages]);

  useEffect(() => {
    fetchBlogs(page);
  }, [page, fetchBlogs]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || page >= totalPages) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight - scrollPosition < SCROLL_THRESHOLD) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, page, totalPages]);

  const resetBlogs = useCallback(() => {
    setBlogs([]);
    setPage(1);
    setTotalPages(1);
    setHasError(false);
  }, []);

  return {
    blogs,
    page,
    totalPages,
    isLoading,
    hasError,
    errorMessage,
    setPage,
    resetBlogs,
    observerTarget,
  };
};

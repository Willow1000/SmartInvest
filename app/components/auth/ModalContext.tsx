'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NewsInsight {
  id: number;
  type: string;
  title: string;
  excerpt: string;
  timestamp: string;
  category: string;
  icon: ReactNode;
  content?: string[]; // Array of paragraphs for better structure
}

interface ModalContextType {
  isSignupOpen: boolean;
  openSignup: () => void;
  closeSignup: () => void;
  isNewsOpen: boolean;
  selectedNews: NewsInsight | null;
  openNews: (news: NewsInsight) => void;
  closeNews: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsInsight | null>(null);

  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  const openNews = (news: NewsInsight) => {
    setSelectedNews(news);
    setIsNewsOpen(true);
  };
  const closeNews = () => {
    setIsNewsOpen(false);
    setSelectedNews(null);
  };

  return (
    <ModalContext.Provider 
      value={{ 
        isSignupOpen, openSignup, closeSignup,
        isNewsOpen, selectedNews, openNews, closeNews 
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

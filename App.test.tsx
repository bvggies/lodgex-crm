import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Declare Jest globals to resolve TypeScript errors
declare const jest: any;
declare const test: any;
declare const expect: any;

// Mock DataContext to prevent errors during rendering in test environment
jest.mock('./DataContext', () => ({
  DataProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useData: () => ({
    currentUser: { name: 'Test User', role: 'Admin' }, // Mock logged-in user
    notifications: [],
    bookings: [],
    properties: [],
    guests: [],
    finance: [],
    tasks: []
  })
}));

// Mock Scroll Animation library to avoid window errors
window.AOS = {
  init: jest.fn(),
  refresh: jest.fn()
};

test('renders dashboard by default', () => {
  render(<App />);
  // Check for main dashboard elements
  const dashboardElement = screen.getByText(/Dashboard/i);
  expect(dashboardElement).toBeInTheDocument();
});

test('sidebar contains navigation links', () => {
  render(<App />);
  const bookingsLink = screen.getByText(/Bookings/i);
  const propertiesLink = screen.getByText(/Properties/i);
  expect(bookingsLink).toBeInTheDocument();
  expect(propertiesLink).toBeInTheDocument();
});
# 📚 Community Library Management System

A web-based library management system built with **React** for the BIWA2110 Web Application Development assignment.

## Student Info
- **Name:** Sellaone Molapo
- **Student ID:** 901020494
- **Course:** Degree in Business Information Technology / Information Technology
- **Module:** Web Application Development (BIWA2110)

## Features

### 📊 Dashboard
- Live stats: unique titles, total copies, users, low-stock count
- Book availability grid
- Automatically highlights books with fewer than 2 copies in red

### 📖 Book Management
- Add new books (title, author, genre, ISBN, quantity)
- Update existing books
- Delete books
- Full form validation

### 🔄 Transactions
- Borrow books (deducts stock)
- Add stock (increases stock)
- Transaction history log with date, type, and amount
- Prevents borrowing more than available stock

### 👥 User Management
- Login system (select user to log in)
- Add new users (name, membership ID, role)
- Update and delete users (admin view only)
- Persistent login state

## Tech Stack

- **Frontend:** React (JSX, Hooks, React Router)
- **State:** React hooks (`useState`, `useEffect`)
- **Persistence:** Browser `localStorage` via a custom `useLocalStorage` hook
- **Styling:** CSS (per-component CSS files)

## Project Structure

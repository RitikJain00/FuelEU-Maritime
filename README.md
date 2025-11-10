# FuelEU Maritime Compliance Dashboard

## Overview
The **FuelEU Maritime Compliance Dashboard** is a full-stack application designed to track and manage ships’ fuel and emissions compliance under EU regulations. It enables:

- Real-time monitoring of compliance balances (CB).
- Banking of surplus compliance credits.
- Applying banked credits to offset deficits.
- Managing pools of ships for collective compliance optimization.

The application is built with a **Hexagonal Architecture**, ensuring a clear separation between core business logic, infrastructure, and presentation layers.

---

## Architecture Summary

### Core (Domain & Application)
- **Services**:
  - `BankingService`: Handles banking and applying compliance credits.
  - `PoolService`: Manages ship pools and redistribution of compliance balances.
- **Models**: `ShipCompliance`, `BankEntry`, `Pool`, `PoolMember`, `Route`.
- **Database**: PostgreSQL with **Prisma ORM**.

### Adapters (Ports)
- **HTTP / API Layer**:
  - `bankingController`: Exposes banking endpoints.
  - `poolController`: Exposes pool management endpoints.
  - `complianceController`

### Frontend
- **React Components**:
  - `BankingTab`: Displays compliance balances and allows banking/applying credits.
  - `PoolTab`: Manages ship pools and allocations.
  - `ShipTab`: Displays ship compliance data.
  - `RouteTab`: Visualizes route emissions and fuel consumption.
- **Custom Hooks**:
  - `useBanking`: Fetches CB balances, performs banking and application of credits.
  - `usePool`: Manages pool creation and member assignments.
  - `useShips`: Fetches ship compliance data.
  - `useRoutes`: Fetches and processes route-level emission data.

---

## Tabs & Functionality

### 1. Banking Tab
- **Purpose**: View CB balances, bank positive credits, and apply banked credits to offset deficits.
- **Hook**: `useBanking`
  - Fetch CB balances (`fetchCreditBalance`).
  - Bank surplus CB (`bankCredit`).
  - Apply banked credits (`applyCredit`).
- **Features**:
  - Shows `CB Before` and `CB After` for a selected ship/year.
  - Prevents banking if CB is negative.
  - Dynamic UI with loading states and error handling.

### 2. Pool Tab
- **Purpose**: Group ships into pools to share compliance credits.
- **Hook**: `usePool`
  - Fetch available ships for the year.
  - Create pools with selected members and their CB balances.
- **Features**:
  - Displays pool summary.
  - Validates members have compliance records.
  - Shows CB redistribution after pooling.

### 3. Ship Tab
- **Purpose**: List individual ships and their compliance records.
- **Hook**: `useShips`
  - Fetch ship details by ID/year.
  - Display compliance balances and history.
- **Features**:
  - Quick lookup of ship CB status.
  - Provides historical CB trends.

### 4. Route Tab
- **Purpose**: Analyze emission data per route.
- **Hook**: `useRoutes`
  - Fetch route records and aggregate GHG intensity.
  - Display fuel consumption, distance, and total emissions.
- **Features**:
  - Shows baseline and actual emissions per route.
  - Supports year and vessel type filters.

---

# Installation Guide – FuelEU Maritime Compliance Application

This guide provides step-by-step instructions to set up the backend and frontend locally.

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18+ recommended)  
- **npm** (v9+ recommended)  
- **PostgreSQL** (v14+ recommended)  
- **Git**  
- Optional: VSCode or any IDE for code navigation  

---

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd FuelEU-Maritime


# Setup Backend

  npm install

  .env contains
  DATABASE_URL="postgresql://user:password@localhost:5432/fueleu?schema=public"
  PORT=3000

  npx prisma migrate dev --name init
  npm run seed

  npm start

  # Setup Frontend

  cd frontend
  npm install
  npm run dev





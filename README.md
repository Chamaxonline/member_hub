# Member Hub Web Application

A full-stack web application designed for member registration and management. It features a modern, responsive React frontend integrated with a robust .NET Core Web API backend.

## Architecture & Tech Stack

### Frontend
- **Framework:** React (v18)
- **Tooling:** Vite
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS (Modern glassmorphism UI, custom CSS variables, and animations)
- **Icons:** Lucide React

### Backend
- **Framework:** .NET 8 Web API
- **ORM:** Entity Framework Core (v10.0.3)
- **Database:** Microsoft SQL Server
- **Architecture:** Controller-based REST API
- **Features:** CORS enabled for frontend communication, Swagger/OpenAPI support for documentation

## Features

- **Member Directory:** View a list of all registered members with their details (Registration Number, Name, Date, Address).
- **Registration Flow:** Register new members with real-time UI validation.
- **Member Updates:** Edit information for existing members transparently.
- **Premium Design:** Implemented with a polished glassmorphism aesthetic, rich hover animations, and dark mode optimizations.

## Getting Started

### Prerequisites
- Node.js (v18+)
- .NET 8 SDK (or later)
- MS SQL Server (Local or remote instance)

### Database Configuration

The backend is configured to connect to a local SQL Server instance named `CHAMATH`. 
If your SQL server has a different name or credentials, update the `ConnectionStrings` in:
`MemberHub.Api/appsettings.json`

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=memberhub;User Id=sa;Password=yourpassword;TrustServerCertificate=True;"
}
```

### Running the Backend (API)

1. Open a terminal and navigate to the backend project:
   ```bash
   cd MemberHub.Api
   ```
2. Apply Entity Framework database migrations (if not already applied):
   ```bash
   dotnet ef database update
   ```
3. Run the API:
   ```bash
   dotnet run
   ```
   The API will typically start on `http://localhost:5161` (check your console output).

### Running the Frontend (UI)

1. Open a second terminal and navigate to the frontend project:
   ```bash
   cd memberhub-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5173`. Simply navigate to this URL in your browser to interact with the application.

## Screenshots & Demos

*(Add any relevant screenshots of the user interface here!)*

*Project originally scaffolded via Antigravity Agent interaction.*

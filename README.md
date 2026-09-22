# Mikefit

Mikefit is a mobile-first fitness dashboard built with static HTML/CSS/JavaScript and Supabase.

## Stack
- GitHub repository
- Static HTML/CSS/JavaScript
- Supabase Auth and Postgres
- Designed for deployment on Cloudflare Pages

## Features
- Email/password sign up and sign in
- Persistent Supabase sessions
- Automatic profile and daily-goal creation through the database trigger
- Hydration logging
- Workout logging
- Meal logging
- Profile editing
- Progress dashboard
- Responsive mobile-first UI

## Security
The browser uses only the Supabase publishable key. No service-role or secret key belongs in this repository.

Supabase Row Level Security protects user-owned profile, goal, hydration, workout-log, meal-log, and progress data.

## Deployment
Deploy the repository as a static site. For Cloudflare Pages, use the repository root as the project directory and no build command. After deployment, add the production site URL to Supabase Auth URL configuration and redirect settings as appropriate.

## Repository
https://github.com/mikemmj/mikefit

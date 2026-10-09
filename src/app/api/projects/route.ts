/**
 * ROUTE HANDLER: GET /api/projects
 *
 * A `route.ts` file returns data instead of a page — this is how you build an
 * API in Next.js. Open http://localhost:3000/api/projects to see the JSON.
 *
 * Optional filter: /api/projects?filter=shopify
 */
import { getProjectsByFilter } from '@/data/projects'

export async function GET(request: Request) {
  const filter = new URL(request.url).searchParams.get('filter') ?? 'all'
  const list = getProjectsByFilter(filter)
  return Response.json({ filter, count: list.length, projects: list })
}

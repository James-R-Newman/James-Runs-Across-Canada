import CharitySiteApp from "./charity_site_tabs_map_blog.jsx";

export default function App() {
  return <CharitySiteApp />;
}

async function fetchSanityPosts() {
  const query = `*[_type == "post"] | order(date desc){
    _id,
    title,
    date,
    content
  }`;

  const rows = await sanity.fetch(query);

  return rows.map((p) => ({
    id: p._id,
    title: p.title,
    date: p.date,
    content: p.content,
    photos: [], // add later
  }));
}

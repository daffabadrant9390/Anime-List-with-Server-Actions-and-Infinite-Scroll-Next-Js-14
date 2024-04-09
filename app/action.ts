'use server';

export const fetchAnimeData = async ({
  pageNumber,
  limit,
}: {
  pageNumber: number;
  limit: number;
}) => {
  const response = await fetch(
    `https://shikimori.one/api/animes?page=${pageNumber}&limit=${limit}&order=popularity`
  );
  const animeData = await response.json();

  return animeData;
};

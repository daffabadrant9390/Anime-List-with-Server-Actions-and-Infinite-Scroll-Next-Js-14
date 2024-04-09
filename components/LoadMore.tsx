'use client';

import Image from 'next/image';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import AnimeCard, { AnimeProp } from './AnimeCard';
import { fetchAnimeData } from '@/app/action';

const MAX_LIMIT_ANIME_DATA_PER_FETCH = 8;
let currentAnimeDataIdx = 0;
let pageNumber = 2; // Initial pageNumber to fetch anime data

function LoadMore() {
  const { ref, inView } = useInView();
  const [animeData, setAnimeData] = useState<AnimeProp[]>([]);

  useEffect(() => {
    if (inView) {
      fetchAnimeData({
        pageNumber,
        limit: MAX_LIMIT_ANIME_DATA_PER_FETCH,
      })
        .then((res) => {
          setAnimeData([...animeData, ...res]);
          pageNumber++;
        })
        .catch((err) => {
          throw new Error(`Error fetching anime data: ${err.message}`);
        });
    }
  }, [inView, animeData]);

  //TODO: Second option without using external library (react-intersection-observer)
  // useEffect(() => {
  //   const loadMoreContainerContent = loadMoreContainerRef?.current;
  //   if (!!loadMoreContainerContent) {
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         const observedElement = entries?.[0];
  //         const isEnteringViewport = !!observedElement.isIntersecting;

  //         if (isEnteringViewport) {
  //           alert('Load More Part 2');
  //         }
  //       },
  //       {
  //         rootMargin: '0px 0px 0px 0px',
  //       }
  //     );

  //     observer.observe(loadMoreContainerContent);

  //     return () => observer.disconnect();
  //   }
  // }, [loadMoreContainerRef]);

  return (
    <>
      <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {(animeData || []).map((item: AnimeProp, index: number) => {
          /**
           * After reach MAX_LIMIT_ANIME_DATA_PER_FETCH, reset the currentAnimeDataIdx to be 0
           * This to support delay animation with Framer motion in AnimeCard. To avoid the other element delaying too long because
           * we use index from animeData array. For example the element 50 will have 25 seconds delay before show the data.
           */
          if (currentAnimeDataIdx === MAX_LIMIT_ANIME_DATA_PER_FETCH) {
            currentAnimeDataIdx = 0;
          }
          currentAnimeDataIdx++;

          return (
            <AnimeCard
              key={`anime-data-item-${item.id}`}
              anime={item}
              index={currentAnimeDataIdx}
            />
          );
        })}
      </section>
      <section ref={ref} className="flex justify-center items-center w-full">
        <div>
          <Image
            src="./spinner.svg"
            alt="spinner"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
      </section>
    </>
  );
}

export default LoadMore;

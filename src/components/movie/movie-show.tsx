import type { Movie } from '@/entities/Movie'
import type { Trailer } from '@/entities/Trailer'
import { AnimatePresence, motion } from 'framer-motion'
import MovieRating from './movie-rating'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import {
  VITE_TMDB_API_URL as TMDB_API_URL,
  VITE_TMDB_API_TOKEN as TMDB_API_TOKEN
} from '@/env'

type MovieShowProps = {
  selectedMovie: Movie | null
  setSelectedMovie: (movie: Movie | null) => void
}

export default function MovieShow(
  {
    selectedMovie,
    setSelectedMovie
  }: MovieShowProps
) {
  // TRAILERS
  const [trailers, setTrailers] = useState<Trailer[]>([])
  const [currentTrailer, setCurrentTrailer] = useState<Trailer | null>(null)

  useEffect(() => {
    setCurrentTrailer(null)
    if (selectedMovie) {
      document.body.classList.add('no-scroll')
      fetch(`${TMDB_API_URL}movie/${selectedMovie.id}/videos?language=pt-BR`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_TOKEN}`
        },
      }).then(response => response.json())
        .then(data => {
          setTrailers(data.results)
          if (data.results.length > 0)
            setCurrentTrailer(data.results[0])
        })
        .catch(error => console.error(error))
    } else {
      document.body.classList.remove('no-scroll')
      setTrailers([])
    }
  }, [selectedMovie])


  return <AnimatePresence>
    {selectedMovie && (
      <motion.div
        exit={
          {
            opacity: 0
          }
        }
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backgroundBlendMode: 'multiply',
        }}
        className='fixed top-0 left-0 w-full h-full z-10 flex flex-col lg:flex-row items-center justify-center gap-20 overflow-auto p-32 sm:p-0'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 sm:h-12 sm:w-12 cursor-pointer absolute top-0 right-0 p-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => {
            setSelectedMovie(null)
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <motion.div
          layoutId={selectedMovie.id.toString()}
          className="flex items-center relative justify-center font-noto"
        >
          <img
            src={selectedMovie.title === 'Anúncio' ? '/n1y094tVDFATSzkTnFxoGZ1qNsG.png' : `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
          />
          <div className="text-white absolute bg-black bg-opacity-50 p-1 bottom-0 w-full">
            <div className="text-lg font-bold uppercase">
              <a href={`https://www.themoviedb.org/movie/${selectedMovie.id}`} target="_blank" rel="noreferrer">{selectedMovie.title}</a>
              <span className="text-xs font-normal ml-1">({selectedMovie.release_date.split('-')[0]})</span>
            </div>
            <MovieRating rating={selectedMovie.vote_average} />
            <p className="text-xs mt-2">
              {selectedMovie.overview.split('.').join('\n')}
            </p>
          </div>
        </motion.div>
        {trailers && (
          <motion.div
            initial={{
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{ duration: 1 }}
            className='flex flex-col gap-4'>
            {currentTrailer && (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${currentTrailer.key}`}
                title={currentTrailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            <motion.div
              initial={{
                y: -100,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              className='flex flex-col gap-4'>
              {trailers.map(trailer => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  key={trailer.id}
                  className={cn('cursor-pointer text-white bg-opacity-50 p-2', { 'bg-slate-700': currentTrailer?.id === trailer.id, 'bg-black': currentTrailer?.id !== trailer.id })}
                  onClick={() => setCurrentTrailer(trailer)}
                >
                  {trailer.name}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
}
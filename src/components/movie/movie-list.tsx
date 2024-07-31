import { useCallback, useEffect, useState, useMemo, memo, useRef } from 'react'
import {
  VITE_TMDB_API_URL as TMDB_API_URL,
  VITE_TMDB_API_TOKEN as TMDB_API_TOKEN
} from '@/env'
import type { Movie } from '@entities/Movie'
import type { MovieResult } from '@entities/MovieResult'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@ui/pagination'
import MovieRating from './movie-rating'
import MovieShow from './movie-show'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

function MovieList() {
  // URL PARAMS
  const params = new URLSearchParams(window.location.search)
  const { page, search } = { page: parseInt(params.get('page') || '1'), search: params.get('search') || '' }
  const searchRef = useRef(search)

  // LOADING
  const [isLoading, setLoading] = useState(true)

  // MOVIES
  const [movies, setMovies] = useState<Movie[] | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  // PAGINATION
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(page)

  useEffect(() => {
    fetch(`${TMDB_API_URL}${searchRef.current.trim() ?
      `search/movie?query=${searchRef.current}&language=pt-BR&page=${page}` :
      `discover/movie?language=pt-BR&page=${page}`}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_TOKEN}`
      },
    })
      .then(response => response.json())
      .then(data => {
        const movieData = data as MovieResult
        setMovies(movieData.results)
        setTotalPages(movieData.total_pages > 500 ? 500 : movieData.total_pages)
      })
      .catch(error => console.error(error)).finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedMovie(null)
      }
    }

    window.addEventListener('keyup', handleKeyUp, true)
    return () => {
      window.removeEventListener('keyup', handleKeyUp, true)
    }
  }, [])

  const setPage = useCallback((page: number) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('page', page.toString())
    window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`)
    setCurrentPage(page)
  }, [])

  const renderedMovies = useMemo(() => (
    movies?.map(movie => (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ y: -10 }}
        key={movie.id}
        layoutId={movie.id.toString()}
        onClick={() => setSelectedMovie(movie)}
        className="group flex items-center justify-center relative font-noto w-[330px] h-[500px]"
      >
        {movie.poster_path ?
          <img
            className="object-cover bg-gray-500"
            src={movie.title === 'Anúncio' ? '/n1y094tVDFATSzkTnFxoGZ1qNsG.png' : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          :
          <div className="bg-gray-500 w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 19H12.01M8.21704 7.69689C8.75753 6.12753 10.2471 5 12 5C14.2091 5 16 6.79086 16 9C16 10.6565 14.9931 12.0778 13.558 12.6852C12.8172 12.9988 12.4468 13.1556 12.3172 13.2767C12.1629 13.4209 12.1336 13.4651 12.061 13.6634C12 13.8299 12 14.0866 12 14.6L12 16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg></div>
        }
        <div className="text-white absolute bg-black bg-opacity-50 p-1 bottom-0 w-full">
          <div className="text-lg font-bold uppercase">
            {movie.title}
            <span className="text-xs font-normal ml-1">({movie.release_date.split('-')[0]})</span>
          </div>
          <MovieRating rating={movie.vote_average} />
          <p className="text-xs mt-2 group-hover:duration-500 opacity-0 hidden group-hover:block group-hover:transition-opacity group-hover:opacity-100 absolute group-hover:relative">
            {movie.overview.length > 100 ? `${movie.overview.slice(0, 100).split('.').join('\n')}...` : movie.overview}
          </p>
        </div>
      </motion.div>
    ))
  ), [movies])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-4xl font-bold text-center">
          <LoaderCircle
            className='animate-spin w-96 h-96'
          />
        </h1>
      </div>
    )
  }

  if (page < 1 || page > 500 || page > totalPages) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-4xl font-bold text-center">Página não encontrada</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg">Voltar</button>
      </div>
    )
  }

  if (movies === null || (movies && movies.length === 0)) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-4xl font-bold text-center">Nenhum filme encontrado</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg">Voltar</button>
      </div>
    )
  }

  return (
    <>
      {selectedMovie && <MovieShow selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie} />}
      <div className='flex flex-col items-center p-4'>
        <div className="container grid grid-cols-4 gap-4">
          {renderedMovies}
        </div>
        {movies &&
          <Pagination className='p-8'>
            <PaginationContent>
              {currentPage > 1 && (
                <>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(page - 1)} />
                  </PaginationItem>
                  {currentPage - 1 > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => setPage(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationLink onClick={() => setPage(currentPage - 1)}>
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationLink isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              {currentPage + 1 < totalPages && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => setPage(currentPage + 1)}>
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => setPage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              {currentPage < totalPages &&
                <PaginationItem>
                  <PaginationNext onClick={() => setPage(currentPage + 1)} />
                </PaginationItem>
              }
            </PaginationContent>
          </Pagination>
        }
      </div>
    </>
  )
}

export default memo(MovieList)
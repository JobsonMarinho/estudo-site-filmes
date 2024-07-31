export interface MovieRatingProps {
  rating: number
}

export default function rating({ rating }: MovieRatingProps) {
  const average = Math.round(rating / 2)

  return (
    <div className='flex space-x-1'>
      {Array.from({ length: 5 }).map((_, index) => {
        const isFull = average > index
        return (
          <svg
            key={index}
            className='w-5 h-5 text-yellow-400'
            fill={isFull ? 'currentColor' : 'none'}
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path
              d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2'
              fillRule='evenodd'
              clipRule='evenodd'
            />
          </svg>
        )
      })}
    </div>
  )
}
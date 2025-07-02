import styles from './Pagination.module.css'

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {

    function createPageNumbers(totalPages: number, currentPage: number): (number | 'left-ellipsis' | 'right-ellipsis')[] {
        const pageNumbers: (number | 'left-ellipsis' | 'right-ellipsis')[] = []

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i)
            }
        } else {
            pageNumbers.push(1)

            if (currentPage > 4) {
            pageNumbers.push('left-ellipsis')
            }

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)
            for (let i = start; i <= end; i++) {
            pageNumbers.push(i)
            }

            if (currentPage < totalPages - 3) {
            pageNumbers.push('right-ellipsis')
            }

            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }


    const handleClick = (page: number | 'left-ellipsis' | 'right-ellipsis') => {
    if (page === 'left-ellipsis') {
        const jump = Math.ceil(totalPages / 3)
        onPageChange(Math.max(1, currentPage - jump))
        return
    }

    if (page === 'right-ellipsis') {
        const jump = Math.ceil(totalPages / 3)
        onPageChange(Math.min(totalPages, currentPage + jump))
        return
    }

    onPageChange(page)
    }

  return (
    <div className="flex justify-between items-center w-full text-preset-4 mt-4 gap-2 flex-wrap">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={styles.button}
        disabled={currentPage === 1}
      >
        <span className="hidden sm:inline">Prev</span>
        <span className="sm:hidden">{'<'}</span>
      </button>

      <div className="flex items-center gap-1 justify-center flex-wrap">
        {createPageNumbers(totalPages, currentPage).map((page, index) => (
        <button
            key={index}
            onClick={() => handleClick(page)}
            className={`px-3 py-1 rounded ${styles.button} ${
            page === currentPage ? styles.active : ''
            }`}
        >
            {page === 'left-ellipsis' || page === 'right-ellipsis' ? '...' : page}
        </button>
        ))}
      </div>

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className={styles.button}
        disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">{'>'}</span>
      </button>
    </div>
  )
}

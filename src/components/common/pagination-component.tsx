"use client"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface PaginationComponentProps {
   currentPage: number
   perPage: number
   totalItems: number
   onPageChange: (page: number) => void
}

export default function PaginationComponent({
   currentPage,
   perPage,
   totalItems,
   onPageChange,
}: PaginationComponentProps) {
   const totalPages = Math.ceil(totalItems / perPage)
   const startItem = (currentPage - 1) * perPage + 1
   const endItem = Math.min(currentPage * perPage, totalItems)

   // Generate page numbers to display
   const getPageNumbers = () => {
      const pages: (number | string)[] = []
      const maxVisiblePages = 5

      if (totalPages <= maxVisiblePages) {
         // Show all pages if total pages is small
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
         }
      } else {
         // Always show first page
         pages.push(1)

         if (currentPage > 3) {
            pages.push("ellipsis-start")
         }

         // Show pages around current page
         const start = Math.max(2, currentPage - 1)
         const end = Math.min(totalPages - 1, currentPage + 1)

         for (let i = start; i <= end; i++) {
            pages.push(i)
         }

         if (currentPage < totalPages - 2) {
            pages.push("ellipsis-end")
         }

         // Always show last page
         if (totalPages > 1) {
            pages.push(totalPages)
         }
      }

      return pages
   }

   const pageNumbers = getPageNumbers()

   return (
      <div className="w-full flex justify-between">
         {/* Items info */}
         <div className="flex items-center shhink-0 gap-4">
            <div className="text-sm text-muted-foreground">
               Showing {startItem} to {endItem} of {totalItems} items
            </div>
            <div className="text-sm text-muted-foreground">
               Page {currentPage} of {totalPages}
            </div>
         </div>

         {/* Pagination controls */}
         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious
                     onClick={() => onPageChange(currentPage - 1)}
                     className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
               </PaginationItem>

               {pageNumbers.map((page, index) => (
                  <PaginationItem key={index}>
                     {typeof page === "number" ? (
                        <PaginationLink
                           onClick={() => onPageChange(page)}
                           isActive={page === currentPage}
                           className="cursor-pointer"
                        >
                           {page}
                        </PaginationLink>
                     ) : (
                        <PaginationEllipsis />
                     )}
                  </PaginationItem>
               ))}

               <PaginationItem>
                  <PaginationNext
                     onClick={() => onPageChange(currentPage + 1)}
                     className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   )
}

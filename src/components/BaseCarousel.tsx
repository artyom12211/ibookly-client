import { 
    useState,
    useEffect
} from "react";
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
} from "./ui/carousel"
import { CompactPagination } from "@telegram-apps/telegram-ui";
// Types 
import type { CarouselApi } from '@/components/ui/carousel';

function Pagination({count, current, className}: {count: number, current: number, className: string}) {
    return(
        <div
          className={className}
          style={{
            alignItems: 'center',
            display: 'inline-flex',
            padding: 20
          }}>
          <CompactPagination mode="ambient">
            {[...Array(count).keys()].map((index) => (
                <CompactPagination.Item
                onClick={function noRefCheck(){}}
                selected={index === current}
                key={index}>
                </CompactPagination.Item>
              ))
            }
          </CompactPagination>
          
          
      </div>
    )
  }

const BaseCarousel = ({ images, itemClass, imgClass, onClick }: {
  images: Array<string>,
  itemClass?: string,
  imgClass?:  string,
  onClick?: () => void 
}) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount]     = useState(0)
  
    useEffect(() => {
      if (!carouselApi) {
        return
      }
   
      setCount(carouselApi.scrollSnapList().length)
      setCurrent(carouselApi.selectedScrollSnap())
   
      carouselApi.on("select", () => {
        setCurrent(carouselApi.selectedScrollSnap())
      })
    }, [carouselApi])

    return(
        <Carousel setApi={setCarouselApi} onClick={onClick}>
            <CarouselContent>
                {images.map((image, i) => 
                <CarouselItem 
                  key={`carousel-item-${i}`}
                  className={`${itemClass || ''}`}
                >
                    <img 
                      className={`studio-carousel-img ${imgClass || ''}`}
                      src={image}
                    />
                </CarouselItem>
                )}
            </CarouselContent>

            {count > 1 && (
                <Pagination 
                className='absolute bottom-auto left-2/4 -translate-x-2/4 -translate-y-full'
                count={count}
                current={current}
                />
            )}

            {/* <CarouselPrevious />
            <CarouselNext /> */}
        </Carousel>
    )
}

export { BaseCarousel }
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Link } from '@/components/Link/Link';
import { 
  initData,
  useSignal,
  hapticFeedback
} from '@telegram-apps/sdk-react';

import { 
  Button,
  Info,
} from '@telegram-apps/telegram-ui';
import { BaseCombobox } from '@/components/BaseCombobox';
import { BaseCarousel } from '@/components/BaseCarousel';
import { Page } from '@/components/Page';

import { decode } from 'js-base64';

import { useInView } from 'react-intersection-observer'

// import '@/app/style.css'
import { useEffect, useState } from 'react';

import studiosAPI from '@/lib/api/studios'

// import HistoryDisplay from '@/components/historyDisplay';

// Types 
import type { CarouselApi } from '@/components/ui/carousel';
import type { Studio } from '@/types/studios';

type ChildProps = {
  filtersDataEmit: (data: {metro: string}) => void,
  filtersData: {metro: string}
};

function Filters(
  { filtersDataEmit, filtersData }: ChildProps,
) {
  const [filterParams, setFilterParams] = useState({} as {metro: string})

  const [metroOptions, setMetroOptions] = useState([{label: '', value: ''}] as [{
    label: string,
    value: string
  }]) 

  const [value, setValue] = useState(filtersData?.metro)
  const [open, setOpen]   = useState(false)
  // const [openPricePopover, setOpenPricePopover] = React.useState(false)
  // const [value, setValue] = React.useState("")

  const getFilters = async () => {
    const getFiltersFetch = await studiosAPI.getFilters()
    if (getFiltersFetch.success) {
      setMetroOptions(getFiltersFetch.data?.metro)
    }
  }
  
  useEffect(() => {
    getFilters()
  }, [])

  useEffect(() => {
    console.log('filter change: ', filterParams)
    filtersDataEmit(filterParams)
  }, [filterParams])

  return (
    <div className="filters mt-1 pb-3 grid gap-x-2 grid-flow-col auto-cols-max fixed z-10 left-2/4 -translate-x-1/2"
      style={{ top: 'var(--tg-viewport-content-safe-area-inset-top)' }}
    >
      <BaseCombobox 
        search_placeholder='Метро'
        not_found='Метро не найдено'
        options={metroOptions}
        value={value}
        onSelect={(currentValue) => {
          console.log('on select: ', currentValue)
          setValue(currentValue === value ? "" : currentValue)
          setFilterParams({ metro: currentValue === value ? "" : currentValue })
          setOpen(false)
        }}
        open={open}
        setOpen={setOpen}
        >
        <Button size='s' mode={!value ? 'gray' : 'bezeled'}
          className='bg-white/80 backdrop-blur-sm shadow-md rounded-lg px-4 py-2 after:rounded-2xl'
        >
          Метро {value}
        </Button>
      </BaseCombobox>
      

      {/* <Popover open={openPricePopover} onOpenChange={setOpenPricePopover}>
          <PopoverTrigger asChild>
            <Button size='s' mode='gray'>
              Цена
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <BaseSlider />
          </PopoverContent>
      </Popover> */}
    </div>
  )
}

function Studios({data}: {data: Studio[]}) {
  return data?.map((item, index) => (
    <Studio data={item} key={index}/>
  ))
}

function Studio({data}: {data: Studio}) {
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

  const minCost      = data.price_range[0]
  // const minRentHours = data.min_rent_hour 
  const images       = data.images_urls

  const handleClickOnStudio = () => {
    hapticFeedback.impactOccurred("medium")
  }

  return(
    <Link className="studio grid gap-y-2" onClick={handleClickOnStudio} to={`/studio/${data.id}`} >
      <BaseCarousel images={images} imgClass='rounded-lg'/>

      <Info type='text' className='!text-left'
        subtitle={`от ${minCost}₽`}>
        {data.title}
      </Info>
    </Link>
  )
}

export default function Home() {
  const navigate = useNavigate()

  const { ref, inView } = useInView({
    triggerOnce: false, // Срабатывает несколько раз
    threshold: 0.1, // Когда 10% элемента в пределах экрана
  });
  const initDataRef = useSignal(initData.state)
  const startParam = initDataRef?.startParam

  const [studios, setStudios]           = useState([]) as any
  const [page, setPage]                 = useState(1)
  const [filterQuery,  setFilterQuery]  = useState('')
  const [filterParams, setFilterParams] = useState({} as {metro: string, [key:string]: string})
  
  const limit = 10 

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['studios', page, limit, filterQuery], // Если что-то поменяется из ключей, заново запустит fetch
    queryFn:   () => studiosAPI.getPreviewStudios(page, limit, filterQuery),
    staleTime: 1000 * 60 * 5,  // 5 минут кеширования
    gcTime:    1000 * 60 * 30, // 30 минут хранения данных в памяти (даже если компонент размонтирован)
  })


  useEffect(() => {
    if (data) {
      setStudios((prev: any) => [...prev, ...data.data])
    }

    // debugger
  }, [data])

  useEffect(() => {
    if (inView && !isLoading && data.data.length > 0) {
      setPage((prevPage) => prevPage + 1); // Загружаем следующую страницу
    }
  }, [inView, isLoading])

  useEffect(() => {
    console.log('Main page has been mounted')

    return () => {
      console.log('Main page has been unmounted')
    }
  }, [])

  const handleFiltersData = (filtersData: {metro: string, [key:string]: string}) => {
    let query = ''

    if (Object.keys(filtersData).length) {
      query = Object.keys(filtersData).reduce((acc, filterKey) => {
        acc += `&${filterKey}=${filtersData[filterKey]}`

        return acc 
      }, '')

      setPage(1)
      setStudios([])
      setFilterParams(filtersData)
      setFilterQuery(query)
    }
   
  }

  if (isLoading && page === 1) {
    // debugger

    return 'Загружаю студии'
  }

  return (
    <Page back={false}>
      <div className="container pt-5 px-4" 
          style={{
            // overflowY: 'scroll',
            height: '95vh'
          }}>
          
        {/* <HistoryDisplay /> */}

        <Filters 
          filtersDataEmit={handleFiltersData}
          filtersData={filterParams}
        />
        
        <div 
          className="studios grid gap-y-4 mt-5"
          >
          {studios && <Studios data={studios}/>} 
        </div>

        <div ref={ref} style={{ height: '20px' }} /> {/* Маркер для отслеживания конца страницы */}
      </div>
    </Page>
  );
}

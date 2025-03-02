import { Page } from '@/components/Page';
import { useQuery } from '@tanstack/react-query';
import studiosAPI from '@/lib/api/studios';
import { useEffect, useState } from 'react';
import { mainButton, secondaryButton, openTelegramLink, shareURL } from '@telegram-apps/sdk-react';
import { encode } from 'js-base64';
import TgUtils from '@/utils/tg';
import { BaseCarousel } from '@/components/BaseCarousel';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  Cell,
  Section,
  Subheadline,
  Title,
  List,
  InlineButtons,
  Modal,
  Placeholder,
} from '@telegram-apps/telegram-ui';
import { InlineButtonsItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem';
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader';
import { useParams } from 'react-router-dom';

// import HistoryDisplay from '@/components/historyDisplay';
 
function Studio({id}: {id: string}) {
  console.log('id: ', id)
  // Загружаем данные студии через React Query
  const { isLoading, isError, data } = useQuery({
    queryKey: ['studio', id],
    queryFn: () => studiosAPI.getStudio(id),
  });

  const [open, setOpen] = useState(false);
  const [tgAdmin, setTgAdmin] = useState<any>(null);
  const [tgChannel, setTgChannel] = useState<any>(null);

  // При получении данных устанавливаем контакты для Telegram
  useEffect(() => {
    if (data?.data?.telegram_contact || data?.data?.telegram_channel) {
      setTgAdmin(data.data.telegram_contact);
      setTgChannel(data.data.telegram_channel);
    }
  }, [data]);

  // Настраиваем основную кнопку, если есть контакт администратора
  useEffect(() => {
    if (tgAdmin && !open) {
      mainButton.setParams({
        text: 'Забронить',
        isVisible: true,
        isEnabled: true,
      });
      mainButton.onClick(() => {
        if (tgAdmin) openTelegramLink(tgAdmin);
      });
    } else {
      mainButton.setParams({
        isVisible: false,
      });
    }
  }, [tgAdmin, open]);

  // Настраиваем вторичную кнопку, если есть контакт канала
  useEffect(() => {
    if (tgChannel && !open) {
      secondaryButton.setParams({
        text: 'Канал студии',
        isVisible: true,
        isEnabled: true,
      });
      secondaryButton.onClick(() => {
        if (tgChannel) openTelegramLink(tgChannel);
      });
    } else {
      secondaryButton.setParams({
        isVisible: false,
      });
    }
  }, [tgChannel, open]);

  // При размонтировании компонента скрываем кнопки
  useEffect(() => {
    return () => {
      mainButton.setParams({ isVisible: false });
      secondaryButton.setParams({ isVisible: false });
    };
  }, []);

  if (isLoading) return <div>Загружаю ...</div>;
  if (isError) return <div>Ошибка ...</div>;

  const studio = data?.data;
  if (!studio || !studio.workhours) return null;

  const is24hours = studio.workhours[0] === 0 && studio.workhours[1] === 24;
  const workhours = is24hours
    ? 'Круглосуточно'
    : `с ${studio.workhours[0]} до ${studio.workhours[1]}`;

  const forwardStudio = () => {
    const webAppUrl = TgUtils.getWebAppUrl();
    const studioLink = `${webAppUrl}?startapp=${encode(`/studio/${id}`)}`;
    shareURL(studioLink, `Фотостудия ${studio.title}`);
  };

  return (
    <>
      <BaseCarousel
        onClick={() => setOpen(true)}
        images={studio.images_urls}
        itemClass="max-h-[40vh]"
        imgClass="w-full h-full object-cover"
      />

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={studio.images_urls.map((image: string) => ({ src: image }))}
        controller={{
          closeOnPullDown: true,
          closeOnBackdropClick: true
        }}
        toolbar={{
          buttons: []
        }}
      />

      <div className="mt-5 px-5">
        <Title level="2" plain={true}>
          {studio.title}
        </Title>
        <Subheadline level="2" plain={true}>
          {`${studio.metro} • ${workhours}`}
        </Subheadline>
      </div>

      <InlineButtons mode="gray" className="mt-5 px-5">
        <InlineButtonsItem text="В избранное (скоро)" disabled>
          <i className="ri-bookmark-line text-xl/5" />
        </InlineButtonsItem>
        <InlineButtonsItem text="Переслать" onClick={forwardStudio}>
          <i className="ri-share-forward-line text-xl/5" />
        </InlineButtonsItem>
      </InlineButtons>

      <List className="mt-5 px-5 pb-4">
        <Section className="rounded-md overflow-hidden" header="О студии">
          {studio.description?.length > 100 ? (
            <Modal
              header={<ModalHeader>Описание</ModalHeader>}
              trigger={
                <Cell subhead="Описание" multiline>
                  {`${studio.description.slice(0, 100)}...`}
                </Cell>
              }
            >
              <Placeholder>
                <div>{studio.description}</div>
              </Placeholder>
            </Modal>
          ) : (
            <Cell subhead="Описание" multiline>
              {studio.description}
            </Cell>
          )}

          <Cell subhead="Цена">
            {`${studio.price_range[0]}₽ - ${studio.price_range[1]}₽`}
          </Cell>
          <Cell subhead="Залов">{`${studio.rooms}`}</Cell>
          <Cell subhead="Часы">{workhours}</Cell>
          <Cell subhead="Высота потолков">{`${studio.height}м`}</Cell>
          <Cell subhead="Адрес" multiline>
            {studio.address}
          </Cell>
          <Cell subhead="Метро">{studio.metro}</Cell>
          {studio.phone && <Cell subhead="Контакты">{studio.phone}</Cell>}
        </Section>
      </List>
    </>
  );
}

export default function StudioPage() {
  const { id } = useParams(); // Получаем параметр id из URL

  return (
    <Page>
      {/* <h1>Студия {id}</h1> */}
      {/* Передаём id в клиентский компонент */}
      
      {/* <HistoryDisplay /> */}

      { 
        id && <Studio id={id}></Studio>
      }
    </Page>
  );
}

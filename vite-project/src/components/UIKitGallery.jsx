import { useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  Drawer,
  EmptyState,
  FormField,
  Grid,
  IconButton,
  Input,
  Modal,
  Pagination,
  Price,
  Rating,
  SearchField,
  Select,
  Skeleton,
  Spinner,
  Stack,
  StatCard,
  Switch,
  Tabs,
  Textarea,
} from './UIComponents.jsx';

const COMPONENTS = [
  'Button', 'IconButton', 'Card', 'CardHeader', 'CardBody', 'CardFooter',
  'Badge', 'Avatar', 'Input', 'Textarea', 'Select', 'Checkbox', 'Switch',
  'FormField', 'SearchField', 'Rating', 'Price', 'Alert', 'EmptyState',
  'Spinner', 'Skeleton', 'Divider', 'Stack', 'Grid', 'Container',
  'StatCard', 'Modal', 'Drawer', 'Tabs', 'Pagination',
];

export default function UIKitGallery() {
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [rating, setRating] = useState(4);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('one');
  const [page, setPage] = useState(2);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Container className="ui-kit">
      <header className="ui-kit__intro">
        <h1>Библиотека компонентов</h1>
        <p>30 переиспользуемых компонентов React для интерфейса Nomad Eats.</p>
        <Badge variant="success">{COMPONENTS.length} компонентов</Badge>
      </header>

      <section className="ui-kit__section">
        <h2>Кнопки и метки</h2>
        <Stack direction="row">
          <Button>Основная</Button>
          <Button variant="secondary">Вторичная</Button>
          <Button variant="danger" size="small">Удалить</Button>
          <Button variant="ghost">Ссылка</Button>
          <IconButton label="Добавить">＋</IconButton>
          <Badge>Новая</Badge><Badge variant="success">Готово</Badge><Badge variant="warning">Ожидание</Badge>
          <Avatar name="Алия Садыкова" /><Avatar name="Nomad" size="small" />
          <Badge variant="danger">Акция</Badge>
        </Stack>
      </section>

      <section className="ui-kit__section">
        <h2>Поля и формы</h2>
        <Grid columns={2}>
          <Input label="Имя" placeholder="Например, Алия" />
          <Select label="Категория" options={['Национальная кухня', 'Десерты', 'Напитки']} />
          <Textarea label="Комментарий" placeholder="Ваш отзыв..." />
          <FormField label="Промокод" hint="Необязательное поле"><input className="ui-input" placeholder="NOMAD10" /></FormField>
          <SearchField value={search} onChange={event => setSearch(event.target.value)} />
          <Stack direction="column">
            <Checkbox label="Согласен с условиями" checked={checked} onChange={event => setChecked(event.target.checked)} />
            <Switch label="Уведомления" checked={enabled} onChange={setEnabled} />
          </Stack>
        </Grid>
      </section>

      <section className="ui-kit__section">
        <h2>Карточки и данные</h2>
        <Grid columns={3}>
          <Card>
            <CardHeader><strong>Карточка блюда</strong><Badge variant="success">В меню</Badge></CardHeader>
            <CardBody><p>Бешбармак по-нарынски</p><Rating value={rating} onChange={setRating} /><p><Price value={450} /></p></CardBody>
            <CardFooter><Button size="small">В корзину</Button><span>⭐ 4.9</span></CardFooter>
          </Card>
          <StatCard label="Заказов сегодня" value="42" trend="+12% за неделю" icon="↗" />
          <Card><CardBody><h3>Вкладки</h3><p>Переключайте разделы</p><Tabs tabs={[{ id: 'one', label: 'Сегодня' }, { id: 'two', label: 'Неделя' }]} activeTab={tab} onChange={setTab} /><p>Выбран раздел: {tab === 'one' ? 'Сегодня' : 'Неделя'}</p></CardBody></Card>
        </Grid>
      </section>

      <section className="ui-kit__section">
        <h2>Состояния и обратная связь</h2>
        <Stack direction="column">
          <Alert title="Заказ принят" variant="success">Мы скоро начнём готовить ваш заказ.</Alert>
          <Alert variant="warning">Проверьте введённые данные.</Alert>
          <Stack direction="row"><Spinner /><Skeleton width="160px" height={20} /><Skeleton width="90px" height={20} /></Stack>
          <Divider label="или" />
          <EmptyState title="Нет новых заказов" description="Здесь появятся ваши заказы." />
        </Stack>
      </section>

      <section className="ui-kit__section">
        <h2>Слои, сетки и навигация</h2>
        <Stack direction="row">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>Открыть модальное окно</Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Открыть панель</Button>
          <Pagination page={page} totalPages={5} onChange={setPage} />
        </Stack>
      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Пример модального окна">
        <p>Содержимое модального окна. Закрывается кнопкой, кликом снаружи или клавишей Escape.</p>
      </Modal>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Боковая панель">
        <p>Переиспользуемая выдвижная панель с закрытием по Escape.</p>
      </Drawer>
    </Container>
  );
}

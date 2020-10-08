import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Image } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  DetailsFoodsContainer,
  DetailsFood,
  DetailsFoodImageContainer,
  DetailsFoodContent,
  DetailsFoodTitle,
  DetailsFoodDescription,
  DetailsFoodPricing,
  AdditionalsContainer,
  Title,
  AdittionalItem,
  AdittionalItemText,
  FinishOrderButtonContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  thumbnail_url: string;
  formattedPrice: string;
  extras: Extra[];
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface ModelizeProps {
  open(): boolean;
  close(): boolean;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food>();
  const modalizeRef = useRef<ModelizeProps>(null);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const { data } = await api.get<Food[]>('orders');

      setOrders(
        data.map(order => ({
          ...order,
          formattedValue: formatValue(order.price),
        })),
      );
    }

    loadOrders();
  }, []);

  const handleFoodDetail = useCallback((food: Food) => {
    setSelectedFood(food);

    modalizeRef.current?.open();
  }, []);

  const handleDeleteFromOrder = useCallback(async (id: number) => {
    await api.delete(`orders/${id}`);

    modalizeRef.current?.close();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              onPress={() => handleFoodDetail(item)}
              key={item.id}
              activeOpacity={0.6}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedValue}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>

      <Modalize ref={modalizeRef} snapPoint={700} modalHeight={700}>
        {selectedFood && (
          <DetailsFoodsContainer>
            <FoodsContainer>
              <DetailsFood>
                <DetailsFoodImageContainer>
                  <Image
                    style={{ width: 400, height: 183 }}
                    source={{
                      uri: selectedFood.image_url,
                    }}
                  />
                </DetailsFoodImageContainer>
                <DetailsFoodContent>
                  <DetailsFoodTitle>{selectedFood.name}</DetailsFoodTitle>
                  <DetailsFoodDescription>
                    {selectedFood.description}
                  </DetailsFoodDescription>
                  <DetailsFoodPricing>
                    {selectedFood.formattedPrice}
                  </DetailsFoodPricing>
                </DetailsFoodContent>
              </DetailsFood>
              <AdditionalsContainer>
                <Title>Adicionais</Title>
                {selectedFood.extras.map(extra => (
                  <AdittionalItem key={extra.id}>
                    <AdittionalItemText>{extra.name}</AdittionalItemText>
                    <AdittionalItemText>
                      {formatValue(extra.value)}
                    </AdittionalItemText>
                  </AdittionalItem>
                ))}
              </AdditionalsContainer>
              <FinishOrderButtonContainer>
                <FinishOrderButton
                  onPress={() => handleDeleteFromOrder(selectedFood.id)}
                >
                  <ButtonText>Retirar do pedido</ButtonText>
                  <IconContainer>
                    <Icon name="x-square" size={24} color="#fff" />
                  </IconContainer>
                </FinishOrderButton>
              </FinishOrderButtonContainer>
            </FoodsContainer>
          </DetailsFoodsContainer>
        )}
      </Modalize>
    </Container>
  );
};

export default Orders;

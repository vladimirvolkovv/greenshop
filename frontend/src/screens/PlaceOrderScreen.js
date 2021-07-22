import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  cart.shippingPrice = cart.itemsPrice > 3000 ? 0 : 800;

  cart.totalPrice = Number(Number(cart.itemsPrice) + Number(cart.shippingPrice)).toFixed(2);

  cart.taxPrice = +0;

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [history, success]);

  const placeOrderHanlder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Доставка</h2>
              <p>
                <strong>Адрес: </strong>
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}, {cart.shippingAddress.city},
                {cart.shippingAddress.address}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Способ оплаты: </h2>
              <strong>{cart.paymentMethod}</strong>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Список товаров</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Ваша корзина пуста</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price} ₽ = {item.qty * item.price} ₽
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Сумма заказа: </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Стоимость товаров</Col>
                  <Col>{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Доставка</Col>
                  <Col>{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Всего</Col>
                  <Col>{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>{error && <Message variant='danger'>{error}</Message>}</ListGroup.Item>
              <ListGroup.Item>
                <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick={placeOrderHanlder}>
                  Оформить заказ
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver } = orderDeliver;

  if (!loading) {
    order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    if (!order || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, order, orderId, successPay, successDeliver, history, userInfo]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <h1>Заказ: {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Доставка</h2>
                  <p>
                    <strong>Имя: </strong> {order.user.name}
                  </p>
                  <p>
                    <strong> Адрес электронной почты: </strong>
                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                  </p>

                  <p>
                    <strong>Адрес: </strong>
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}, {order.shippingAddress.city},
                    {order.shippingAddress.address}
                  </p>
                  {order.isDelivered ? (
                    <Message variant='success'>Доставлено в {order.deliveredAt}</Message>
                  ) : (
                    <Message variant='danger'>Не доставлено</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Способ оплаты: </h2>
                  <p>
                    <strong>{order.paymentMethod}</strong>
                  </p>
                  {order.isPaid ? (
                    <Message variant='success'>Оплачено в {order.paidAt}</Message>
                  ) : (
                    <Message variant='danger'>Не оплачено</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Список товаров</h2>
                  {order.orderItems.length === 0 ? (
                    <Message>Ваша корзина пуста</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image src={item.image} alt={item.name} fluid rounded></Image>
                            </Col>
                            <Col>
                              <Link className='text-decoration-none' to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
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
                      <Col>{order.itemsPrice} ₽</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Доставка</Col>
                      <Col>{order.shippingPrice.toFixed(2)} ₽</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Всего</Col>
                      <Col>{order.totalPrice.toFixed(2)} ₽</Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loading && <Loader />}
                      {/* {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton currency='USD' amount={order.totalPrice} onSuccess={successPaymentHandler} />
                      )} */}
                    </ListGroup.Item>
                  )}
                  {userInfo && userInfo.isAdmin && !order.isDelivered && (
                    <ListGroup.Item>
                      <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                        Доставлен
                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderScreen;

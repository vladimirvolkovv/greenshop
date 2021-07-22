import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? +location.search.split('=')[1] : 1;
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Корзина</h1>
        {cartItems.length === 0 ? (
          <Message>
            Ваша корзина пуста <Link to='/'> На главную</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col className='m-auto' md={3}>
                    <Link className='text-decoration-none' to={`/product/${item.product}`}>
                      {item.name}
                    </Link>
                  </Col>
                  <Col className='m-auto' md={2}>
                    {item.price} ₽
                  </Col>
                  <Col md={2} className='m-auto'>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) => dispatch(addToCart(item.product, +e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2} className='m-auto'>
                    <Button type='button' variant='primary' onClick={() => removeFromCartHandler(item.product)}>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Всего: {cartItems.reduce((acc, item) => acc + item.qty, 0)} товаров</h2>
              На сумму: {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)} ₽
            </ListGroup.Item>
            <ListGroup.Item>
              <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                К оформлению
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;

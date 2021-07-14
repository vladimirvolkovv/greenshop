import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline className='d-flex flex-row'>
      <Form.Control
        type='text'
        size='sm'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Поиск товаров'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' size='sm' className='rounded-0'>
        Найти
      </Button>
    </Form>
  );
};

export default SearchBox;

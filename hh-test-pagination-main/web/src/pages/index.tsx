import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container, Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
};

const ITEMS_PER_PAGE = 20;
const PAGES_PER_SECTION = 10;

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch("http://localhost:3000/users", { method: "GET" });
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [] } };
    }

    return {
      props: { statusCode: 200, users: await res.json() },
    };
  } catch (e) {
    return { props: { statusCode: 500, users: [] } };
  }
};



export const Home = ({ statusCode, users }: TGetServerSideProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const handlePaginationClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const usersOnCurrentPage = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {usersOnCurrentPage.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination className={"mt-5"}>
            <Pagination.First onClick={() => handlePaginationClick(1)} />
            <Pagination.Prev
              onClick={() => handlePaginationClick(Math.max(currentPage - 1, 1))}
            />

            {[...Array(Math.min(totalPages, PAGES_PER_SECTION)).keys()].map((index) => (
              <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePaginationClick(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePaginationClick(Math.min(currentPage + 1, totalPages))}
              />
            <Pagination.Last onClick={() => handlePaginationClick(totalPages)} />
          </Pagination>

        </Container>
      </main>
    </>
  );
};

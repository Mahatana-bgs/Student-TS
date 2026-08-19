--
-- PostgreSQL database dump
--

\restrict B2PSNaYakpOgHywWnyxYf203IQal4N7xbLuLoKbgxPqcvN4UUoBxqlMs9yi9tYR

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: students; Type: TABLE; Schema: public; Owner: raven
--

CREATE TABLE public.students (
    id integer NOT NULL,
    last_name character varying(100) NOT NULL,
    first_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    major character varying(100),
    date_of_birth date
);


ALTER TABLE public.students OWNER TO raven;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: raven
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO raven;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: raven
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: raven
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: raven
--

COPY public.students (id, last_name, first_name, email, major, date_of_birth) FROM stdin;
1	Smith	John	john.smith@example.com	Computer Science	2001-03-15
2	Doe	Emma	emma.doe@example.com	Networking	2000-11-02
\.


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: raven
--

SELECT pg_catalog.setval('public.students_id_seq', 2, true);


--
-- Name: students students_email_key; Type: CONSTRAINT; Schema: public; Owner: raven
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_email_key UNIQUE (email);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: raven
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict B2PSNaYakpOgHywWnyxYf203IQal4N7xbLuLoKbgxPqcvN4UUoBxqlMs9yi9tYR


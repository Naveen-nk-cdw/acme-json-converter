--
-- PostgreSQL database dump
--

\restrict C7BCfxOuhCcaBjEBj0yKCyd4faHCtUyeatx3VeiNF9FHl1RJjbLv4tUlrA6krIz

-- Dumped from database version 15.18 (Debian 15.18-1.pgdg13+1)
-- Dumped by pg_dump version 18.4

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
-- Name: email; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.email (
    name character varying(20)
);


ALTER TABLE public.email OWNER TO "ACME";

--
-- Name: users; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.users (
    name character varying(20)
);


ALTER TABLE public.users OWNER TO "ACME";

--
-- Data for Name: email; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.email (name) FROM stdin;
silentFellow
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.users (name) FROM stdin;
silentFellow
\.


--
-- PostgreSQL database dump complete
--

\unrestrict C7BCfxOuhCcaBjEBj0yKCyd4faHCtUyeatx3VeiNF9FHl1RJjbLv4tUlrA6krIz


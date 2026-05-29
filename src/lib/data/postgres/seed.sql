--
-- PostgreSQL database dump
--

\restrict cRhT1JvERi2A15ZZ0iAck2EDLIBEvvXVcRkN4ybNdvUDFdYTXl4xwOAdX7tgQOE

-- Dumped from database version 15.18 (Debian 15.18-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Homebrew)

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

--
-- Name: etl_chunk_stage; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_chunk_stage AS ENUM (
    'read',
    'process',
    'write'
);


ALTER TYPE public.etl_chunk_stage OWNER TO "ACME";

--
-- Name: etl_chunk_status; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_chunk_status AS ENUM (
    'pending',
    'processed',
    'failed'
);


ALTER TYPE public.etl_chunk_status OWNER TO "ACME";

--
-- Name: etl_consolidation_status; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_consolidation_status AS ENUM (
    'inserted',
    'updated',
    'unchanged'
);


ALTER TYPE public.etl_consolidation_status OWNER TO "ACME";

--
-- Name: etl_idempotency_status; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_idempotency_status AS ENUM (
    'clean_run',
    'reprocessed',
    'overwritten'
);


ALTER TYPE public.etl_idempotency_status OWNER TO "ACME";

--
-- Name: etl_lookup_source_type; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_lookup_source_type AS ENUM (
    'in_memory',
    'database',
    'file'
);


ALTER TYPE public.etl_lookup_source_type OWNER TO "ACME";

--
-- Name: etl_output_level; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_output_level AS ENUM (
    'error',
    'info',
    'debug'
);


ALTER TYPE public.etl_output_level OWNER TO "ACME";

--
-- Name: etl_output_status; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_output_status AS ENUM (
    'success',
    'failed',
    'skipped'
);


ALTER TYPE public.etl_output_status OWNER TO "ACME";

--
-- Name: etl_output_type; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_output_type AS ENUM (
    'database',
    'file',
    'api_stream'
);


ALTER TYPE public.etl_output_type OWNER TO "ACME";

--
-- Name: etl_run_stage; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_run_stage AS ENUM (
    'extract',
    'stage',
    'transform',
    'load'
);


ALTER TYPE public.etl_run_stage OWNER TO "ACME";

--
-- Name: etl_run_status; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_run_status AS ENUM (
    'pending',
    'running,success',
    'failed'
);


ALTER TYPE public.etl_run_status OWNER TO "ACME";

--
-- Name: etl_trigger_type; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_trigger_type AS ENUM (
    'scheduled',
    'event_based',
    'manual'
);


ALTER TYPE public.etl_trigger_type OWNER TO "ACME";

--
-- Name: etl_validation_level; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_validation_level AS ENUM (
    'none',
    'warn',
    'strict'
);


ALTER TYPE public.etl_validation_level OWNER TO "ACME";

--
-- Name: etl_validation_status; Type: TYPE; Schema: public; Owner: ACME
--

CREATE TYPE public.etl_validation_status AS ENUM (
    'valid',
    'invalid',
    'partial'
);


ALTER TYPE public.etl_validation_status OWNER TO "ACME";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chunk_outputs; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.chunk_outputs (
    chunk_output_id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_id uuid,
    chunk_id uuid,
    output_type public.etl_output_type,
    file_name character varying(500),
    s3_key character varying(1000),
    file_size_bytes bigint,
    checksum character varying(128),
    record_count integer,
    output_status public.etl_output_status,
    schema_version character varying(50),
    generated_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.chunk_outputs OWNER TO "ACME";

--
-- Name: consolidated_outputs; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.consolidated_outputs (
    consolidated_output_id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_id uuid,
    output_level public.etl_output_level,
    output_type public.etl_output_type,
    file_name character varying(500),
    s3_key character varying(1000),
    file_size_bytes bigint,
    checksum character varying(128),
    input_file_count integer,
    record_count bigint,
    consolidation_status public.etl_consolidation_status,
    generated_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.consolidated_outputs OWNER TO "ACME";

--
-- Name: etl_chunks; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.etl_chunks (
    chunk_id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_id uuid,
    chunk_sequence integer,
    chunk_file_name character varying(500),
    chunk_s3_key character varying(1000),
    chunk_size_bytes bigint,
    chunk_checksum character varying(128),
    record_start_index bigint,
    record_end_index bigint,
    record_count integer,
    chunk_status public.etl_chunk_status,
    processing_stage public.etl_chunk_stage,
    retry_count integer,
    worker_id character varying(200),
    kafka_partition integer,
    kafka_offset bigint,
    last_error_code character varying(100),
    last_error_message text,
    processing_started_at timestamp with time zone,
    processing_completed_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.etl_chunks OWNER TO "ACME";

--
-- Name: etl_runs; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.etl_runs (
    run_id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_name character varying(200),
    source_file_name character varying(500),
    source_file_s3_key character varying(1000),
    source_file_size_bytes bigint,
    source_file_checksum character varying(128),
    mapping_config_id uuid,
    run_status public.etl_run_status,
    run_stage public.etl_run_stage,
    total_chunks integer,
    processed_chunks integer,
    failed_chunks integer,
    retried_chunks integer,
    total_input_records bigint,
    valid_input_records bigint,
    invalid_input_records bigint,
    final_output_s3_key character varying(1000),
    final_output_checksum character varying(128),
    requested_by character varying(200),
    trigger_type public.etl_trigger_type,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.etl_runs OWNER TO "ACME";

--
-- Name: idempotency_keys; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.idempotency_keys (
    idempotency_key character varying(255) NOT NULL,
    entity_type character varying(50),
    entity_id character varying(255),
    run_id uuid,
    processing_status public.etl_idempotency_status,
    response_payload jsonb,
    created_at timestamp with time zone,
    expires_at timestamp with time zone
);


ALTER TABLE public.idempotency_keys OWNER TO "ACME";

--
-- Name: lookup_datasets; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.lookup_datasets (
    lookup_dataset_id uuid DEFAULT gen_random_uuid() NOT NULL,
    lookup_name character varying(200),
    lookup_version character varying(100),
    source_type public.etl_lookup_source_type,
    source_location character varying(1000),
    checksum character varying(128),
    is_active boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.lookup_datasets OWNER TO "ACME";

--
-- Name: mapping_configs; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.mapping_configs (
    mapping_config_id uuid DEFAULT gen_random_uuid() NOT NULL,
    config_name character varying(200),
    config_version integer,
    source_format character varying(50),
    target_format character varying(50),
    is_active boolean,
    is_default boolean,
    product_mapping jsonb,
    category_mapping jsonb,
    category_map_mapping jsonb,
    validation_rules jsonb,
    transformation_rules jsonb,
    lookup_config jsonb,
    description text,
    created_by character varying(200),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.mapping_configs OWNER TO "ACME";

--
-- Name: processing_errors; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.processing_errors (
    error_id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_id uuid,
    chunk_id uuid,
    chunk_output_id uuid,
    consolidated_output_id uuid,
    error_stage character varying(50),
    error_code character varying(100),
    error_message text,
    error_details jsonb,
    is_retryable boolean,
    occurrence_count integer,
    first_occurred_at timestamp with time zone,
    last_occurred_at timestamp with time zone,
    created_at timestamp with time zone
);


ALTER TABLE public.processing_errors OWNER TO "ACME";

--
-- Name: run_events; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.run_events (
    event_id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_id uuid,
    chunk_id uuid,
    event_type character varying(100),
    event_status character varying(50),
    event_message text,
    event_payload jsonb,
    created_at timestamp with time zone
);


ALTER TABLE public.run_events OWNER TO "ACME";

--
-- Name: run_lookup_usage; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.run_lookup_usage (
    run_id uuid NOT NULL,
    lookup_dataset_id uuid NOT NULL
);


ALTER TABLE public.run_lookup_usage OWNER TO "ACME";

--
-- Name: validation_reports; Type: TABLE; Schema: public; Owner: ACME
--

CREATE TABLE public.validation_reports (
    validation_report_id uuid DEFAULT gen_random_uuid() NOT NULL,
    run_id uuid,
    consolidated_output_id uuid,
    chunk_id uuid,
    validation_level public.etl_validation_level,
    validated_object_type public.etl_output_type,
    validated_object_path character varying(1000),
    validation_status public.etl_validation_status,
    total_rules_checked integer,
    total_errors integer,
    total_warnings integer,
    report_s3_key character varying(1000),
    summary jsonb,
    errors_json jsonb,
    validated_at timestamp with time zone,
    created_at timestamp with time zone
);


ALTER TABLE public.validation_reports OWNER TO "ACME";

--
-- Data for Name: chunk_outputs; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.chunk_outputs (chunk_output_id, run_id, chunk_id, output_type, file_name, s3_key, file_size_bytes, checksum, record_count, output_status, schema_version, generated_at, created_at, updated_at, metadata) FROM stdin;
\.


--
-- Data for Name: consolidated_outputs; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.consolidated_outputs (consolidated_output_id, run_id, output_level, output_type, file_name, s3_key, file_size_bytes, checksum, input_file_count, record_count, consolidation_status, generated_at, created_at, updated_at, metadata) FROM stdin;
\.


--
-- Data for Name: etl_chunks; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.etl_chunks (chunk_id, run_id, chunk_sequence, chunk_file_name, chunk_s3_key, chunk_size_bytes, chunk_checksum, record_start_index, record_end_index, record_count, chunk_status, processing_stage, retry_count, worker_id, kafka_partition, kafka_offset, last_error_code, last_error_message, processing_started_at, processing_completed_at, created_at, updated_at, metadata) FROM stdin;
\.


--
-- Data for Name: etl_runs; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.etl_runs (run_id, run_name, source_file_name, source_file_s3_key, source_file_size_bytes, source_file_checksum, mapping_config_id, run_status, run_stage, total_chunks, processed_chunks, failed_chunks, retried_chunks, total_input_records, valid_input_records, invalid_input_records, final_output_s3_key, final_output_checksum, requested_by, trigger_type, started_at, completed_at, created_at, updated_at, metadata) FROM stdin;
\.


--
-- Data for Name: idempotency_keys; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.idempotency_keys (idempotency_key, entity_type, entity_id, run_id, processing_status, response_payload, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: lookup_datasets; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.lookup_datasets (lookup_dataset_id, lookup_name, lookup_version, source_type, source_location, checksum, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mapping_configs; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.mapping_configs (mapping_config_id, config_name, config_version, source_format, target_format, is_active, is_default, product_mapping, category_mapping, category_map_mapping, validation_rules, transformation_rules, lookup_config, description, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: processing_errors; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.processing_errors (error_id, run_id, chunk_id, chunk_output_id, consolidated_output_id, error_stage, error_code, error_message, error_details, is_retryable, occurrence_count, first_occurred_at, last_occurred_at, created_at) FROM stdin;
\.


--
-- Data for Name: run_events; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.run_events (event_id, run_id, chunk_id, event_type, event_status, event_message, event_payload, created_at) FROM stdin;
\.


--
-- Data for Name: run_lookup_usage; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.run_lookup_usage (run_id, lookup_dataset_id) FROM stdin;
\.


--
-- Data for Name: validation_reports; Type: TABLE DATA; Schema: public; Owner: ACME
--

COPY public.validation_reports (validation_report_id, run_id, consolidated_output_id, chunk_id, validation_level, validated_object_type, validated_object_path, validation_status, total_rules_checked, total_errors, total_warnings, report_s3_key, summary, errors_json, validated_at, created_at) FROM stdin;
\.


--
-- Name: chunk_outputs chunk_outputs_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.chunk_outputs
    ADD CONSTRAINT chunk_outputs_pkey PRIMARY KEY (chunk_output_id);


--
-- Name: consolidated_outputs consolidated_outputs_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.consolidated_outputs
    ADD CONSTRAINT consolidated_outputs_pkey PRIMARY KEY (consolidated_output_id);


--
-- Name: etl_chunks etl_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.etl_chunks
    ADD CONSTRAINT etl_chunks_pkey PRIMARY KEY (chunk_id);


--
-- Name: etl_runs etl_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.etl_runs
    ADD CONSTRAINT etl_runs_pkey PRIMARY KEY (run_id);


--
-- Name: idempotency_keys idempotency_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.idempotency_keys
    ADD CONSTRAINT idempotency_keys_pkey PRIMARY KEY (idempotency_key);


--
-- Name: lookup_datasets lookup_datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.lookup_datasets
    ADD CONSTRAINT lookup_datasets_pkey PRIMARY KEY (lookup_dataset_id);


--
-- Name: mapping_configs mapping_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.mapping_configs
    ADD CONSTRAINT mapping_configs_pkey PRIMARY KEY (mapping_config_id);


--
-- Name: processing_errors processing_errors_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.processing_errors
    ADD CONSTRAINT processing_errors_pkey PRIMARY KEY (error_id);


--
-- Name: run_events run_events_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.run_events
    ADD CONSTRAINT run_events_pkey PRIMARY KEY (event_id);


--
-- Name: run_lookup_usage run_lookup_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.run_lookup_usage
    ADD CONSTRAINT run_lookup_usage_pkey PRIMARY KEY (run_id, lookup_dataset_id);


--
-- Name: validation_reports validation_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.validation_reports
    ADD CONSTRAINT validation_reports_pkey PRIMARY KEY (validation_report_id);


--
-- Name: chunk_outputs chunk_outputs_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.chunk_outputs
    ADD CONSTRAINT chunk_outputs_chunk_id_fkey FOREIGN KEY (chunk_id) REFERENCES public.etl_chunks(chunk_id);


--
-- Name: chunk_outputs chunk_outputs_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.chunk_outputs
    ADD CONSTRAINT chunk_outputs_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- Name: consolidated_outputs consolidated_outputs_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.consolidated_outputs
    ADD CONSTRAINT consolidated_outputs_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- Name: etl_chunks etl_chunks_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.etl_chunks
    ADD CONSTRAINT etl_chunks_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- Name: etl_runs etl_runs_mapping_config_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.etl_runs
    ADD CONSTRAINT etl_runs_mapping_config_id_fkey FOREIGN KEY (mapping_config_id) REFERENCES public.mapping_configs(mapping_config_id);


--
-- Name: idempotency_keys idempotency_keys_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.idempotency_keys
    ADD CONSTRAINT idempotency_keys_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- Name: processing_errors processing_errors_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.processing_errors
    ADD CONSTRAINT processing_errors_chunk_id_fkey FOREIGN KEY (chunk_id) REFERENCES public.etl_chunks(chunk_id);


--
-- Name: processing_errors processing_errors_chunk_output_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.processing_errors
    ADD CONSTRAINT processing_errors_chunk_output_id_fkey FOREIGN KEY (chunk_output_id) REFERENCES public.chunk_outputs(chunk_output_id);


--
-- Name: processing_errors processing_errors_consolidated_output_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.processing_errors
    ADD CONSTRAINT processing_errors_consolidated_output_id_fkey FOREIGN KEY (consolidated_output_id) REFERENCES public.consolidated_outputs(consolidated_output_id);


--
-- Name: processing_errors processing_errors_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.processing_errors
    ADD CONSTRAINT processing_errors_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- Name: run_events run_events_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.run_events
    ADD CONSTRAINT run_events_chunk_id_fkey FOREIGN KEY (chunk_id) REFERENCES public.etl_chunks(chunk_id);


--
-- Name: run_events run_events_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.run_events
    ADD CONSTRAINT run_events_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- Name: run_lookup_usage run_lookup_usage_lookup_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.run_lookup_usage
    ADD CONSTRAINT run_lookup_usage_lookup_dataset_id_fkey FOREIGN KEY (lookup_dataset_id) REFERENCES public.lookup_datasets(lookup_dataset_id);


--
-- Name: run_lookup_usage run_lookup_usage_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.run_lookup_usage
    ADD CONSTRAINT run_lookup_usage_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- Name: validation_reports validation_reports_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.validation_reports
    ADD CONSTRAINT validation_reports_chunk_id_fkey FOREIGN KEY (chunk_id) REFERENCES public.etl_chunks(chunk_id);


--
-- Name: validation_reports validation_reports_consolidated_output_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.validation_reports
    ADD CONSTRAINT validation_reports_consolidated_output_id_fkey FOREIGN KEY (consolidated_output_id) REFERENCES public.consolidated_outputs(consolidated_output_id);


--
-- Name: validation_reports validation_reports_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ACME
--

ALTER TABLE ONLY public.validation_reports
    ADD CONSTRAINT validation_reports_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.etl_runs(run_id);


--
-- PostgreSQL database dump complete
--

\unrestrict cRhT1JvERi2A15ZZ0iAck2EDLIBEvvXVcRkN4ybNdvUDFdYTXl4xwOAdX7tgQOE


#!/bin/bash

echo Coverage Summary of all tests

SUMMARY_DIR=coverage/post-test-summary
mkdir -p $SUMMARY_DIR
npx istanbul-merge --out $SUMMARY_DIR/coverage.json $(find coverage -name coverage-final.json)

npx istanbul report --include $SUMMARY_DIR/coverage.json text

npx istanbul report --include $SUMMARY_DIR/coverage.json text-summary

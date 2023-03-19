#!/bin/bash

echo
echo Coverage Summary of all tests
echo

SUMMARY_DIR=coverage/post-test-summary
mkdir -p $SUMMARY_DIR
yarn -s istanbul-merge --out $SUMMARY_DIR/coverage.json $(find coverage -name coverage-final.json)

yarn -s istanbul report --include $SUMMARY_DIR/coverage.json text

yarn -s istanbul report --include $SUMMARY_DIR/coverage.json text-summary

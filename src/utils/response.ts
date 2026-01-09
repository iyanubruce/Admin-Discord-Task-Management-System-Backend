import { Response } from 'express';
import HttpStatus from 'http-status-codes';

export const errResponse = <T>(
  res: Response,
  payload: T,
  statusCode: number = HttpStatus.OK,
  errors: unknown = null
): Response => {
  const isError = statusCode >= 400;
  const status = isError ? 'error' : 'success';
  const payloadKey = isError ? 'message' : 'data';

  const response = {
    status,
    [payloadKey]: payload,
    ...(isError && errors ? { data: errors } : {})
  };

  return res.status(statusCode).json(response);
};

export const pagingResponse = (
  payload: any[],
  total: number,
  page: number,
  limit: number,
  url: string
): {
  payload: any[];
  paging: any;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
} => {
  const pageUrl = new URL(url);

  let next;
  if (Math.ceil(total / limit) > page) {
    next = page + 1;
  }

  let previous;
  if (page > 1) {
    previous = page - 1;
  }

  // for paging
  const paging: any = {};
  paging.total_items = total;
  paging.page_size = limit;
  paging.current = page;
  paging.count = payload.length || 0;
  paging.next = next;
  paging.previous = previous;

  // for links
  // --previous
  const links = [];
  if (previous !== undefined) {
    const prevUrl = pageUrl;
    prevUrl.searchParams.set('page', previous.toString());
    const prev = {
      href: prevUrl.href,
      rel: 'prev',
      method: 'GET'
    };
    links.push(prev);
  }

  // --current
  const currentUrl = pageUrl;
  currentUrl.searchParams.set('page', page.toString());
  const current = {
    href: currentUrl.href,
    rel: 'current',
    method: 'GET'
  };
  links.push(current);

  // --next
  if (next !== undefined) {
    const nextUrl = pageUrl;
    nextUrl.searchParams.set('page', next.toString());
    const nextPage = {
      href: nextUrl.href,
      rel: 'next',
      method: 'GET'
    };
    links.push(nextPage);
  }

  return {
    payload,
    paging,
    links
  };
};

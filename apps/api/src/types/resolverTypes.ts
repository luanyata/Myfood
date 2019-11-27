import { GraphQLFieldResolver } from 'graphql'
import { Context } from '.'

export type Resolver<TArgs, TSource = {}> = GraphQLFieldResolver<
  TSource,
  Context,
  TArgs
>

export enum MutationType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED'
}

export interface SubscriptionArgs {
  where: {
    mutationIn: MutationType[]
  }
}

export interface SubscriptionPayload<T> {
  mutation: MutationType
  node: T
}

export interface SubscriptionResolver<TNode, TSource = {}> {
  subscribe: Resolver<SubscriptionArgs, TSource>
  resolve: Resolver<SubscriptionArgs, SubscriptionPayload<TNode>>
}

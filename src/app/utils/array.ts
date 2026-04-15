/**
 * 数组工具函数
 */

import type { OutlineNode } from '@/app/api/outline';

/**
 * 递归打平树形结构，获取所有叶子节点
 * @param nodes 树形节点数组
 * @param getChildren 获取子节点的函数，默认取 node.children
 * @returns 所有叶子节点的一维数组
 * @example
 * // 默认使用 children 字段
 * flattenLeafNodes(nodes)
 * // 自定义子节点字段
 * flattenLeafNodes(nodes, (node) => node.items)
 */
export const flattenLeafNodes = <T>(
  nodes: T[],
  getChildren: (node: T) => T[] | undefined = (node) => (node as any).children,
): T[] => {
  const result: T[] = [];
  for (const node of nodes) {
    const children = getChildren(node);
    if (children && children.length > 0) {
      // 递归处理子节点
      result.push(...flattenLeafNodes(children, getChildren));
    } else {
      // 叶子节点，直接添加
      result.push(node);
    }
  }
  return result;
};

/**
 * 在树形结构中根据 id 查找节点
 * @param nodes 树形节点数组
 * @param targetId 目标节点 id
 * @returns 找到的节点，未找到返回 null
 */
export const findNodeById = <T extends { id: string; children?: T[] }>(
  nodes: T[],
  targetId: string,
): T | null => {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (node.children) {
      const found = findNodeById(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 递归打平树形结构，获取所有节点（包括非叶子节点）
 * @param nodes 树形节点数组
 * @param getChildren 获取子节点的函数，默认取 node.children
 * @returns 所有节点的一维数组
 * @example
 * // 默认使用 children 字段
 * flattenAllNodes(nodes)
 * // 自定义子节点字段
 * flattenAllNodes(nodes, (node) => node.items)
 */
export const flattenAllNodes = <T>(
  nodes: T[],
  getChildren: (node: T) => T[] | undefined = (node) => (node as any).children,
): T[] => {
  const result: T[] = [];
  for (const node of nodes) {
    // 添加当前节点
    result.push(node);
    // 递归处理子节点
    const children = getChildren(node);
    if (children && children.length > 0) {
      result.push(...flattenAllNodes(children, getChildren));
    }
  }
  return result;
};

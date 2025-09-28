'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { filteredEmissionsAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import { convertCO2ToTrees } from '@/utils/carbonToTrees';

interface ForestVisualizationProps {
  maxTrees?: number;
  animationDelay?: number;
}

const ForestVisualization: React.FC<ForestVisualizationProps> = ({
  maxTrees = 100,
  animationDelay = 100
}) => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const { colors, theme } = useTheme();
  const [animatedTrees, setAnimatedTrees] = useState(0);

  // 배출량 감소로 구한 나무 수 계산
  const savedTrees = useMemo(() => {
    const dataMap = new Map<string, number>();

    emissions.forEach(emission => {
      const key = emission.yearMonth;
      if (!dataMap.has(key)) {
        dataMap.set(key, 0);
      }
      dataMap.set(key, dataMap.get(key)! + emission.emissions);
    });

    const sortedData = Array.from(dataMap.entries()).sort(([a], [b]) => a.localeCompare(b));
    let totalSavedTrees = 0;

    for (let i = 1; i < sortedData.length; i++) {
      const [, currentEmissions] = sortedData[i];
      const [, previousEmissions] = sortedData[i - 1];
      const reduction = previousEmissions - currentEmissions;

      if (reduction > 0) {
        totalSavedTrees += convertCO2ToTrees(reduction);
      }
    }

    return Math.min(totalSavedTrees, maxTrees);
  }, [emissions, maxTrees]);

  // 애니메이션 효과
  useEffect(() => {
    let currentCount = 0;
    const target = savedTrees;

    const timer = setInterval(() => {
      if (currentCount < target) {
        currentCount += 1;
        setAnimatedTrees(currentCount);
      } else {
        clearInterval(timer);
      }
    }, animationDelay);

    return () => clearInterval(timer);
  }, [savedTrees, animationDelay]);

  // 격자 생성
  const gridSize = Math.ceil(Math.sqrt(maxTrees));
  const trees = Array.from({ length: maxTrees }, (_, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const isAlive = index < animatedTrees;
    const delay = index * 50; // 개별 애니메이션 지연

    return {
      id: index,
      row,
      col,
      isAlive,
      delay
    };
  });

  // 나무 아이콘 선택
  const getTreeIcon = (isAlive: boolean, index: number) => {
    if (!isAlive) return '🌫️'; // 회색 미스트

    // 다양한 나무 아이콘
    const treeIcons = ['🌳', '🌲', '🌴', '🌿'];
    return treeIcons[index % treeIcons.length];
  };

  const TreeIcon: React.FC<{
    tree: typeof trees[0];
    size: number;
  }> = ({ tree, size }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(tree.isAlive);
      }, tree.delay);

      return () => clearTimeout(timer);
    }, [tree.isAlive, tree.delay]);

    return (
      <div
        style={{
          fontSize: `${size}px`,
          transition: 'all 0.3s ease-in-out',
          transform: isVisible ? 'scale(1)' : 'scale(0.3)',
          opacity: isVisible ? 1 : 0.3,
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = isVisible ? 'scale(1.2)' : 'scale(0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isVisible ? 'scale(1)' : 'scale(0.3)';
        }}
      >
        {getTreeIcon(tree.isAlive, tree.id)}
      </div>
    );
  };

  return (
    <div style={{
      background: colors.surface,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 12px ${colors.border}40`,
      border: `1px solid ${colors.border}`
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: colors.text
          }}>
            🌲 우리가 구한 숲
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: colors.textSecondary
          }}>
            탄소 감축으로 살릴 수 있는 나무들을 시각화했어요
          </p>
        </div>

        <div style={{
          background: theme === 'dark' ? '#0f2f0f' : '#f0fdf4',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${colors.success}40`,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '800',
            color: colors.success,
            lineHeight: 1
          }}>
            {animatedTrees}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary
          }}>
            / {maxTrees} 그루
          </div>
        </div>
      </div>

      {/* 진행바 */}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: colors.surfaceSecondary,
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        <div style={{
          width: `${(animatedTrees / maxTrees) * 100}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${colors.success}, ${colors.primary})`,
          borderRadius: '4px',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>

      {/* 숲 격자 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: '4px',
        justifyItems: 'center',
        alignItems: 'center',
        minHeight: '200px',
        background: theme === 'dark' ?
          'linear-gradient(135deg, #0a1a0a, #1a2a1a)' :
          'linear-gradient(135deg, #f8fffe, #ecfdf5)',
        borderRadius: '12px',
        padding: '16px',
        border: `1px solid ${colors.border}`
      }}>
        {trees.map(tree => (
          <TreeIcon
            key={tree.id}
            tree={tree}
            size={Math.max(16, Math.min(32, 400 / gridSize))}
          />
        ))}
      </div>

      {/* 하단 통계 */}
      <div style={{
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '16px',
        padding: '16px',
        background: colors.surfaceSecondary,
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: colors.success
          }}>
            💨 {Math.floor(animatedTrees * 260).toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary
          }}>
            연간 산소 (kg)
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: colors.primary
          }}>
            🌬️ {Math.floor(animatedTrees * 27).toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary
          }}>
            대기 정화 (kg)
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: colors.warning
          }}>
            🍃 {Math.floor(animatedTrees / 100)}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary
          }}>
            작은 숲 개수
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: colors.chart.accent
          }}>
            🏠 {Math.floor(animatedTrees * 22 / 1000)}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary
          }}>
            가정 1년 탄소량
          </div>
        </div>
      </div>

      {/* 성장 애니메이션 정보 */}
      {animatedTrees > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: theme === 'dark' ? '#0f1f0f' : '#f0fff4',
          borderRadius: '8px',
          border: `1px solid ${colors.success}40`,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            color: colors.success,
            fontWeight: '600'
          }}>
            🌱 나무가 자라고 있어요!
            {animatedTrees === savedTrees ?
              ' 완성된 숲을 확인해보세요!' :
              ` ${savedTrees - animatedTrees}그루 더 자랄 예정이에요.`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ForestVisualization;
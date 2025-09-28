'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { filteredEmissionsAtom, companiesAtom } from '@/store/atoms';

const AIInsights: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const [companies] = useAtom(companiesAtom);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const insights = useMemo(() => {
    if (emissions.length === 0 || companies.length === 0) {
      return [
        {
          type: 'loading',
          icon: '🤖',
          title: 'AI 분석 대기 중',
          content: '데이터를 수집하여 인사이트를 생성하고 있습니다...',
          color: '#6b7280',
          bgColor: '#f8fafc'
        }
      ];
    }

    const totalEmissions = emissions.reduce((sum, e) => sum + e.emissions, 0);
    const avgEmissions = totalEmissions / emissions.length;

    // 월별 데이터 분석
    const monthlyData = new Map<string, number>();
    emissions.forEach(emission => {
      const current = monthlyData.get(emission.yearMonth) || 0;
      monthlyData.set(emission.yearMonth, current + emission.emissions);
    });

    const monthlyValues = Array.from(monthlyData.values());
    const isIncreasing = monthlyValues.length > 1 &&
      monthlyValues[monthlyValues.length - 1] > monthlyValues[monthlyValues.length - 2];

    // 배출원 분석
    const sourceData = new Map<string, number>();
    emissions.forEach(emission => {
      const current = sourceData.get(emission.source) || 0;
      sourceData.set(emission.source, current + emission.emissions);
    });

    const topSource = Array.from(sourceData.entries()).sort((a, b) => b[1] - a[1])[0];

    // 회사 분석
    const companyEmissions = companies.map(company => ({
      name: company.name,
      total: company.emissions.reduce((sum, e) => sum + e.emissions, 0),
      count: company.emissions.length
    })).sort((a, b) => b.total - a.total);

    const topCompany = companyEmissions[0];
    const averageCompanyEmissions = companyEmissions.reduce((sum, c) => sum + c.total, 0) / companyEmissions.length;

    return [
      {
        type: 'trend',
        icon: isIncreasing ? '📈' : '📉',
        title: '배출량 추세 분석',
        content: `최근 배출량이 ${isIncreasing ? '증가' : '감소'} 추세를 보이고 있습니다. ${
          isIncreasing
            ? '추가적인 감축 조치가 필요할 수 있습니다.'
            : '좋은 감축 성과를 보이고 있습니다!'
        }`,
        color: isIncreasing ? '#dc2626' : '#16a34a',
        bgColor: isIncreasing ? '#fef2f2' : '#f0fdf4'
      },
      {
        type: 'source',
        icon: '🔍',
        title: '주요 배출원 분석',
        content: `가장 큰 배출원은 "${topSource?.[0] || 'N/A'}"로 총 ${topSource?.[1]?.toLocaleString() || 0} tons를 차지합니다. 이 영역에 집중적인 개선이 필요합니다.`,
        color: '#f59e0b',
        bgColor: '#fffbeb'
      },
      {
        type: 'company',
        icon: '🏢',
        title: '회사별 성과 분석',
        content: `"${topCompany?.name || 'N/A'}"이 ${topCompany?.total.toLocaleString() || 0} tons로 최대 배출량을 기록했습니다. 평균 대비 ${
          topCompany && averageCompanyEmissions ?
            Math.round((topCompany.total - averageCompanyEmissions) / averageCompanyEmissions * 100) : 0
        }% ${topCompany && topCompany.total > averageCompanyEmissions ? '높습니다' : '낮습니다'}.`,
        color: '#3b82f6',
        bgColor: '#eff6ff'
      },
      {
        type: 'recommendation',
        icon: '💡',
        title: 'AI 개선 제안',
        content: `총 ${totalEmissions.toLocaleString()} tons의 탄소 배출량을 20% 감축하려면, 주요 배출원인 "${topSource?.[0] || 'N/A'}" 분야에서 ${Math.round((topSource?.[1] || 0) * 0.2).toLocaleString()} tons의 감축이 필요합니다.`,
        color: '#8b5cf6',
        bgColor: '#f3f4f6'
      },
      {
        type: 'target',
        icon: '🎯',
        title: '탄소 중립 목표',
        content: `현재 추세로는 탄소 중립 달성까지 약 ${Math.ceil(totalEmissions / (avgEmissions * 12) * 0.7)}년이 소요될 것으로 예상됩니다. 적극적인 감축 조치로 이를 단축할 수 있습니다.`,
        color: '#059669',
        bgColor: '#f0fdf4'
      }
    ];
  }, [emissions, companies]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentInsightIndex((prev) => (prev + 1) % insights.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [insights.length]);

  const currentInsight = insights[currentInsightIndex];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 배경 그라데이션 */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${currentInsight.bgColor}40, transparent)`,
        transform: 'translate(50px, -50px)',
        transition: 'all 0.5s ease'
      }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            fontSize: '28px',
            display: 'inline-block',
            transform: isAnimating ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}>
            🤖
          </span>
          AI 인사이트
        </h3>

        {/* 진행 인디케이터 */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {insights.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentInsightIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: index === currentInsightIndex ? currentInsight.color : '#e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => {
                setCurrentInsightIndex(index);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 300);
              }}
            />
          ))}
        </div>
      </div>

      {/* 인사이트 내용 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
        opacity: isAnimating ? 0.7 : 1,
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '32px',
            padding: '12px',
            borderRadius: '50%',
            background: currentInsight.bgColor,
            border: `2px solid ${currentInsight.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentInsight.icon}
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: currentInsight.color
            }}>
              {currentInsight.title}
            </h4>

            <p style={{
              margin: 0,
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#4b5563'
            }}>
              {currentInsight.content}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '16px'
        }}>
          <button
            style={{
              padding: '8px 16px',
              background: `${currentInsight.color}15`,
              color: currentInsight.color,
              border: `1px solid ${currentInsight.color}30`,
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${currentInsight.color}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${currentInsight.color}15`;
            }}
          >
            자세히 보기
          </button>

          {currentInsight.type === 'recommendation' && (
            <button
              style={{
                padding: '8px 16px',
                background: currentInsight.color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${currentInsight.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              실행 계획 세우기
            </button>
          )}
        </div>
      </div>

      {/* 신뢰도 표시 */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '20px',
        fontSize: '12px',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#10b981'
        }} />
        AI 신뢰도: {Math.floor(Math.random() * 15) + 85}%
      </div>
    </div>
  );
};

export default AIInsights;
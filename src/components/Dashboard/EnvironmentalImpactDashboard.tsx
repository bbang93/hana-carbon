'use client';

import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import { filteredEmissionsAtom } from '@/store/atoms';
import { useTheme } from '@/hooks/useTheme';
import {
  getEnvironmentalImpact,
  calculateEnvironmentalGrade,
  getTreeIcon
} from '@/utils/carbonToTrees';

const EnvironmentalImpactDashboard: React.FC = () => {
  const [emissions] = useAtom(filteredEmissionsAtom);
  const { colors, theme } = useTheme();

  const environmentalData = useMemo(() => {
    // 총 배출량 계산
    const totalEmissions = emissions.reduce((sum, emission) => sum + emission.emissions, 0);

    // 월평균 배출량
    const uniqueMonths = new Set(emissions.map(e => e.yearMonth)).size;
    const averageMonthlyEmissions = uniqueMonths > 0 ? totalEmissions / uniqueMonths : 0;

    // 환경 등급 계산
    const environmentalGrade = calculateEnvironmentalGrade(averageMonthlyEmissions);

    // 배출량 감소 시뮬레이션 (목표: 현재 대비 20% 감소)
    const targetReduction = totalEmissions * 0.2;
    const environmentalImpact = getEnvironmentalImpact(targetReduction);

    // 환경 건강도 점수 계산
    // 기준: 글로벌 친환경 기업 벤치마킹 기준 (50톤/월 = 100점)
    // 공식: 100 - (실제배출량 ÷ 글로벌우수기준) × 100
    const globalBenchmark = 50; // A+ 등급 기준선
    const healthScore = Math.max(0, Math.min(100, 100 - (averageMonthlyEmissions / globalBenchmark) * 100));

    return {
      totalEmissions,
      averageMonthlyEmissions,
      environmentalGrade,
      environmentalImpact,
      healthScore,
      targetReduction
    };
  }, [emissions]);

  // 툴팁 컴포넌트
  const Tooltip: React.FC<{
    children: React.ReactNode;
    content: string;
  }> = ({ children, content }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
      <div
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
        {showTooltip && (
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: colors.text,
            color: colors.surface,
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            {content}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${colors.text}`
            }} />
          </div>
        )}
      </div>
    );
  };

  const ImpactCard: React.FC<{
    icon: string;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    bgColor: string;
    tooltip?: string;
  }> = ({ icon, title, value, subtitle, color, bgColor, tooltip }) => (
    <div style={{
      background: colors.surface,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 12px ${colors.border}40`,
      border: `1px solid ${colors.border}`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: color
      }} />

      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        margin: '0 auto 16px auto'
      }}>
        {icon}
      </div>

      <h4 style={{
        margin: '0 0 8px 0',
        fontSize: '14px',
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
      }}>
        {title}
        {tooltip && (
          <Tooltip content={tooltip}>
            <span style={{ cursor: 'help', opacity: 0.7 }}>ℹ️</span>
          </Tooltip>
        )}
      </h4>

      <div style={{
        fontSize: '32px',
        fontWeight: '800',
        color,
        marginBottom: '8px'
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      <p style={{
        margin: 0,
        fontSize: '12px',
        color: colors.textSecondary
      }}>
        {subtitle}
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 환경 등급 헤더 */}
      <div style={{
        background: colors.surface,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: `0 4px 12px ${colors.border}40`,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: colors.text
          }}>
            🌍 환경 영향 대시보드
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: colors.textSecondary
          }}>
탄소 감축으로 만들어지는 환경 보호 효과 · 실제 생활 영향 비교
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontSize: '48px'
          }}>
            {getTreeIcon(environmentalData.healthScore)}
          </div>
          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              color: environmentalData.environmentalGrade.color,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {environmentalData.environmentalGrade.grade}
              <Tooltip content={`${environmentalData.environmentalGrade.benchmark} (${environmentalData.environmentalGrade.globalPercentile})`}>
                <span style={{ cursor: 'help', opacity: 0.7, fontSize: '16px' }}>ℹ️</span>
              </Tooltip>
            </div>
            <div style={{
              fontSize: '12px',
              color: colors.textSecondary,
              textAlign: 'center'
            }}>
              {environmentalData.environmentalGrade.description}
            </div>
            <div style={{
              fontSize: '10px',
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: '4px'
            }}>
              {environmentalData.environmentalGrade.globalPercentile}
            </div>
            <div style={{
              fontSize: '9px',
              color: environmentalData.environmentalGrade.color,
              textAlign: 'center',
              marginTop: '2px',
              fontWeight: '600'
            }}>
              월 {Math.round(environmentalData.averageMonthlyEmissions)}톤 vs 기준 50톤
            </div>
          </div>
        </div>
      </div>

      {/* 환경 효과 카드들 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <ImpactCard
          icon="🌳"
          title="구할 수 있는 나무"
          value={environmentalData.environmentalImpact.savedTrees}
          subtitle="소나무 기준 (수령 20년)"
          color={colors.success}
          bgColor={theme === 'dark' ? '#0f2f0f' : '#f0fdf4'}
          tooltip="성인 소나무(높이 10m) 1그루가 연간 22kg CO2 흡수 기준. 산림청 공식 데이터 바탕"
        />

        <ImpactCard
          icon="🌲"
          title="형성될 작은 숲"
          value={environmentalData.environmentalImpact.equivalentForests}
          subtitle={`축구장 ${environmentalData.environmentalImpact.forestAreaInSoccerFields}개 크기`}
          color={colors.primary}
          bgColor={theme === 'dark' ? '#0f1f3f' : '#f0f9ff'}
          tooltip="작은 숲 1개 = 나무 100그루 = 축구장 0.5개 넓이 기준"
        />

        <ImpactCard
          icon="💨"
          title="연간 산소 생산"
          value={`${environmentalData.environmentalImpact.oxygenProduced.toLocaleString()}kg`}
          subtitle="4인 가족 1년에 필요한 산소량"
          color={colors.chart.secondary}
          bgColor={theme === 'dark' ? '#1f0f2f' : '#faf5ff'}
          tooltip="나무 1그루가 연간 260kg 산소 생산. 성인 1명이 하루 필요한 산소량 0.8kg 기준"
        />

        <ImpactCard
          icon="🌬️"
          title="대기 정화량"
          value={`${environmentalData.environmentalImpact.airPurified.toLocaleString()}kg`}
          subtitle={`승용차 ${Math.floor(environmentalData.environmentalImpact.airPurified / 4.6).toLocaleString()}km 주행 절약 효과`}
          color={colors.warning}
          bgColor={theme === 'dark' ? '#2f1f0f' : '#fffbf0'}
          tooltip="나무 1그루가 연간 27kg 대기오염물질 제거. 승용차 1km 주행 시 4.6kg CO2 배출 기준"
        />
      </div>

      {/* 진행도 및 목표 설정 */}
      <div style={{
        background: colors.surface,
        borderRadius: '16px',
        padding: '24px',
        boxShadow: `0 4px 12px ${colors.border}40`,
        border: `1px solid ${colors.border}`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h4 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 환경 건강도
            <Tooltip content="글로벌 친환경 기업 벤치마킹 기준 점수. 50톤/월 이하 = 100점">
              <span style={{ cursor: 'help', opacity: 0.7, fontSize: '14px' }}>ℹ️</span>
            </Tooltip>
          </h4>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: environmentalData.environmentalGrade.color
          }}>
            {Math.round(environmentalData.healthScore)}/100
          </div>
        </div>

        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: colors.surfaceSecondary,
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{
            width: `${environmentalData.healthScore}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${colors.error}, ${colors.warning}, ${colors.success})`,
            borderRadius: '6px',
            transition: 'width 1s ease-in-out'
          }} />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '12px',
          color: colors.textSecondary
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>현재 월평균: {Math.round(environmentalData.averageMonthlyEmissions)} tons CO₂</span>
            <span>글로벌 우수기준: 50 tons CO₂</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{environmentalData.environmentalGrade.benchmark}</span>
            <span>목표: A+ 등급 달성</span>
          </div>
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: colors.surfaceSecondary,
            borderRadius: '6px',
            fontSize: '11px'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>환경등급 설명:</div>
            <div>A+: 월 50톤 이하 (친환경 선도기업) | A: 51-100톤 (인증기업) | B: 101-150톤 (우수기업)</div>
          </div>
        </div>
      </div>

      {/* 액션 아이템 */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.success}20, ${colors.primary}20)`,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${colors.success}40`
      }}>
        <h4 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚀 다음 달 환경 목표
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '4px' }}>
              🌱 구할 수 있는 나무
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: colors.success }}>
              +{Math.floor(environmentalData.targetReduction * 45)} 그루
            </div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>
              소나무 기준 (20년생) = 아파트 수목 {Math.floor(environmentalData.targetReduction * 45 / 20)}채
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '4px' }}>
              🚗 승용차 주행 절약
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primary }}>
              {Math.floor(environmentalData.targetReduction * 1000 / 4.6).toLocaleString()} km
            </div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>
              서울↔부산 {Math.floor(environmentalData.targetReduction * 1000 / 4.6 / 325)}회 왕복
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '4px' }}>
              ⚡ 가정 전기료 절약
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: colors.warning }}>
              {Math.floor(environmentalData.targetReduction * 1000 / (350 * 0.4575)).toLocaleString()}개월
            </div>
            <div style={{ fontSize: '11px', color: colors.textSecondary }}>
              4인 가족 월 전기료 절약 효과
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpactDashboard;
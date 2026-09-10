import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { X, Star, CheckCircle2 } from 'lucide-react-native';
import { VehicleReview } from '../types';
import { supabase } from '../lib/supabase';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
}

export function ReviewsModal({ isOpen, onClose, vehicleName }: ReviewsModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const satisfactionOptions = [
    { value: 1, emoji: '😡', label: 'Very dissatisfied' },
    { value: 2, emoji: '😞', label: 'Dissatisfied' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Satisfied' },
    { value: 5, emoji: '😁', label: 'Very satisfied' },
  ];
  const [reviewsList, setReviewsList] = useState<VehicleReview[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadReviews = async () => {
      setIsLoadingReviews(true);
      setReviewsError('');
      const { data, error } = await supabase
        .from('reviews')
        .select('id, customer_name, rating, comment, created_at')
        .order('created_at', { ascending: false });

      if (!isMounted) return;
      if (error) {
        setReviewsError(error.message);
        setReviewsList([]);
      } else {
        setReviewsList((data || []).map((review) => ({
          id: String(review.id),
          author: review.customer_name || 'Anonymous',
          rating: Number(review.rating),
          date: new Date(review.created_at).toLocaleDateString(),
          comment: review.comment || 'No comment provided.',
          verified: true,
        })));
      }
      setIsLoadingReviews(false);
    };

    void loadReviews();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleSubmitReview = async () => {
    if (!rating) {
      Alert.alert('Select a Rating', 'Please select an emoji rating first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error('Please sign in before submitting feedback.');
      }

      const customerName =
        typeof authData.user.user_metadata?.full_name === 'string'
          ? authData.user.user_metadata.full_name
          : authData.user.email?.split('@')[0] || 'SmartDrive Customer';
      const customerEmail = authData.user.email || '';
      const savedComment = comment.trim() || null;

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: authData.user.id,
          customer_email: customerEmail,
          customer_name: customerName,
          rating,
          comment: savedComment,
        })
        .select('id, customer_name, rating, comment, created_at')
        .single();

      if (error || !data) {
        throw new Error(error?.message || 'Your feedback could not be submitted.');
      }

      const newRev: VehicleReview = {
        id: String(data.id),
        author: data.customer_name,
        rating: Number(data.rating),
        date: new Date(data.created_at).toLocaleDateString(),
        comment: data.comment || '',
        verified: true,
      };

      setReviewsList((current) => [newRev, ...current]);
      setRating(0);
      setComment('');
      Alert.alert('Review Submitted! ⭐', 'Thank you. Your feedback is now visible to the SmartDrive admin.');
    } catch (error) {
      Alert.alert(
        'Submission Failed',
        error instanceof Error ? error.message : 'Your feedback could not be submitted.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          
          {/* MODAL HEADER */}
          <View style={styles.head}>
            <View>
              <Text style={styles.title}>Customer Reviews</Text>
              <Text style={styles.sub}>{vehicleName} • 4.9 Rating</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            
            {/* RATING INPUT SECTION */}
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>How satisfied are you? 💜</Text>
              <Text style={styles.inputSub}>Help us improve your SmartDrive experience.</Text>

              <View style={styles.satisfactionRow}>
                {satisfactionOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.satisfactionBtn, rating === option.value && styles.satisfactionBtnActive]}
                    onPress={() => setRating(option.value)}
                    accessibilityLabel={option.label}
                  >
                    <Text style={styles.satisfactionEmoji}>{option.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.satisfactionFeedback}>
                {satisfactionOptions.find((option) => option.value === rating)?.label || 'Select a rating'}
              </Text>

              <Text style={styles.commentLabel}>Tell us about your experience (optional)</Text>
              <TextInput 
                style={styles.textArea}
                placeholder="Tell us what you liked or what we can improve..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmitReview}
                disabled={isSubmitting}
              >
                <Text style={styles.submitBtnText}>
                  {isSubmitting ? 'Saving your review...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* EXISTING REVIEWS LIST */}
            <Text style={styles.listTitle}>Customer Reviews ({reviewsList.length})</Text>
            {isLoadingReviews ? <Text style={styles.listMessage}>Loading reviews...</Text> : null}
            {reviewsError ? <Text style={styles.listError}>{reviewsError}</Text> : null}
            {!isLoadingReviews && !reviewsError && reviewsList.length === 0 ? <Text style={styles.listMessage}>No reviews have been submitted yet.</Text> : null}
            {!isLoadingReviews && reviewsList.map((item) => (
              <View key={item.id} style={styles.reviewCard}>
                <View style={styles.reviewHead}>
                  <View>
                    <Text style={styles.author}>{item.author}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                  <View style={styles.starBadge}>
                    <Star size={12} color="#EAB308" fill="#EAB308" />
                    <Text style={styles.starBadgeText}>{item.rating}.0</Text>
                  </View>
                </View>
                <Text style={styles.comment}>{item.comment}</Text>
              </View>
            ))}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  sub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { marginBottom: 10 },
  inputBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  inputLabel: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  inputSub: { fontSize: 10, color: '#64748B', marginBottom: 12 },
  satisfactionRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 6 },
  satisfactionBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  satisfactionBtnActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#7C3AED',
    transform: [{ scale: 1.06 }],
  },
  satisfactionEmoji: { fontSize: 22 },
  satisfactionFeedback: { textAlign: 'center', color: '#7C3AED', fontSize: 10, fontWeight: '700', marginBottom: 12 },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
    height: 92,
    marginBottom: 10,
  },
  commentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  submitBtn: {
    backgroundColor: '#6D28D9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  submitBtnDisabled: { opacity: 0.6 },
  listTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  listMessage: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingVertical: 18 },
  listError: { fontSize: 11, color: '#DC2626', textAlign: 'center', paddingVertical: 12 },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  reviewHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  date: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  starBadgeText: { fontSize: 10, fontWeight: '800', color: '#854D0E' },
  comment: { fontSize: 12, color: '#475569', lineHeight: 18, marginTop: 8 },
});
